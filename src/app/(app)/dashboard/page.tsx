// src/app/(app)/dashboard/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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

  // Fetch current accept-messages status
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

  // Fetch all messages
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
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">User Dashboard</h1>

      {/* Profile link section */}
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Your Unique Link</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* Accept messages toggle */}
      <div className="mb-6 flex items-center gap-3">
        <button
          role="switch"
          aria-checked={acceptMessages}
          disabled={isSwitchLoading}
          onClick={handleSwitchChange}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            acceptMessages ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700"
          } disabled:opacity-50`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              acceptMessages ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className="text-sm font-medium">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <div className="mb-4 border-t border-zinc-200 dark:border-zinc-800" />

      {/* Refresh button */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button
          variant="outline"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Messages list */}
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
              className="flex flex-col justify-between rounded-lg border border-zinc-200 p-4 shadow-sm dark:border-zinc-800"
            >
              <p className="mb-3 text-sm text-zinc-800 dark:text-zinc-200">
                {message.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteMessage(message._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}