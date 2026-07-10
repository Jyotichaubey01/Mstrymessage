"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const defaultMessageString =
  "What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?";

const Page = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();

  const [content, setContent] = useState("");
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(
    defaultMessageString.split("||")
  );
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleMessageClick = (message: string) => {
    setContent(message);
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const res = await fetch("/api/suggest-messages", { method: "POST" });
      const data = await res.json();
      if (data.success && data.message) {
        setSuggestedMessages(data.message.split("||"));
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch suggestions.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch suggested messages.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty message",
        description: "Please write a message before sending.",
        variant: "destructive",
      });
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Sent!", description: "Your message was sent anonymously." });
        setContent("");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send message.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "Not supported",
        description: "Voice input isn't supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 p-6 sm:p-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Public Profile Link</h1>

      <div className="mb-6">
        <p className="mb-2 text-sm font-medium">
          Send Anonymous Message to @{username}
        </p>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's a hobby you've recently started?"
          className="min-h-[100px] resize-none"
        />
      </div>

      <div className="mb-8 flex justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMicClick}
          className={isListening ? "animate-pulse border-red-500" : ""}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button onClick={handleSendMessage} disabled={isSending}>
          {isSending ? "Sending..." : "Send It"}
        </Button>
      </div>

      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
        Click on any message below to select it.
      </p>

      <Button
        onClick={fetchSuggestedMessages}
        disabled={isSuggestLoading}
        className="mb-6"
      >
        {isSuggestLoading ? "Loading suggestions..." : "Suggest New Messages"}
      </Button>

      <div className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="mb-4 text-xl font-semibold">Messages</h2>
        <div className="flex flex-col gap-3">
          {suggestedMessages.map((message, index) => (
            <button
              key={index}
              onClick={() => handleMessageClick(message)}
              className="rounded-md border border-zinc-200 px-4 py-3 text-left text-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {message}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;