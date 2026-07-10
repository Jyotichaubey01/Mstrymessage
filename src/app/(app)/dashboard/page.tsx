// src/app/(app)/dashboard/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RefreshCcw, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Message = {
  _id: string;
  content: string;
  createdAt: string;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(true);

  const username = session?.user?.username;

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await fetch("/api/accept-messages");
      const data = await res.json();
      setAcceptMessages(data.isAcceptingMessages);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load message settings.",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [toast]);

  const fetchMessages = useCallback(
    async (showToast = false) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/get-messages");
        const data = await res.json();
        setMessages(data.messages || []);
        if (showToast) {
          toast({ title: "Refreshed", description: "Showing latest messages." });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    const newValue = !acceptMessages;
    try {
      const res = await fetch("/api/accept-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptMessages: newValue }),
      });
      if (!res.ok) throw new Error();
      setAcceptMessages(newValue);
      toast({
        title: "Updated",
        description: `You are now ${newValue ? "accepting" : "not accepting"} messages.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update message settings.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/delete-message/${messageId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      toast({ title: "Deleted", description: "Message removed." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  const profileUrl =
    typeof window !== "undefined" && username
      ? `${window.location.origin}/u/${username}`
      : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({ title: "Copied!", description: "Profile link copied to clipboard." });
  };

  if (!session?.user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-zinc-600 dark:text-zinc-400">
          Please sign in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 p-6 sm:p-8">
      <h1 className="mb-6 text-3xl font-bold">User Dashboard</h1>

      {/* Copy link section */}
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Copy Your Unique Link</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <Button onClick={copyToClipboard} className="shrink-0">
            Copy
          </Button>
        </div>
      </div>

      {/* Accept messages toggle */}
      <div className="mb-4 flex items-center gap-3">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-sm font-medium">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <div className="mb-6 border-t border-zinc-200 dark:border-zinc-800" />

      {/* Refresh icon button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => fetchMessages(true)}
        disabled={isLoading}
        className="mb-4"
      >
        <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      </Button>

      {/* Messages grid */}
      {isLoading ? (
        <p className="text-sm text-zinc-500">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No messages to display yet. Share your link to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {messages.map((message) => (
            <div
              key={message._id}
              className="relative rounded-lg border border-zinc-200 p-5 shadow-sm dark:border-zinc-800"
            >
              <button
                onClick={() => handleDeleteMessage(message._id)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white transition hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="pr-10 text-lg font-semibold leading-snug">
                {message.content}
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                {new Date(message.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}