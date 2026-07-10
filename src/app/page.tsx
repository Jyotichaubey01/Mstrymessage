// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleFeedback = [
  {
    from: "MysteryGuest",
    message: "Do you have any book recommendations?",
    time: "1 day ago",
  },
  {
    from: "MysteryGuest",
    message: "Your presentation today was really clear and well organized!",
    time: "2 hours ago",
  },
  {
    from: "MysteryGuest",
    message: "I think you'd be great in a leadership role — you always listen.",
    time: "3 days ago",
  },
  {
    from: "MysteryGuest",
    message: "Thanks for always being so patient when explaining things.",
    time: "5 days ago",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sampleFeedback.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = sampleFeedback[index];

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-950 px-6 py-20 text-center text-white sm:px-8">
      <h1 className="mb-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
        Dive into the World of Anonymous Feedback
      </h1>
      <p className="mb-10 text-lg text-zinc-400">
        Mystery Message — Where your identity remains a secret.
      </p>

      {/* Rotating message card */}
      <div className="mb-12 w-full max-w-md rounded-xl bg-white p-6 text-left text-zinc-900 shadow-xl">
        <h3 className="mb-4 text-xl font-bold">
          Message from {current.from}
        </h3>
        <div className="mb-2 flex items-start gap-2">
          <Mail className="mt-1 h-4 w-4 shrink-0 text-zinc-500" />
          <p className="text-base font-medium leading-snug">
            {current.message}
          </p>
        </div>
        <p className="mt-3 text-sm text-zinc-500">{current.time}</p>
      </div>

      <div className="mb-16 flex gap-4">
        <Link href="/sign-up">
          <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-200">
            Get Started
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button
            size="lg"
            variant="outline"
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            Sign In
          </Button>
        </Link>
      </div>

      {/* Feature cards */}
      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-2 font-semibold">100% Anonymous</h3>
          <p className="text-sm text-zinc-400">
            Senders are never identified. Speak freely, without judgment.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-2 font-semibold">One Link to Share</h3>
          <p className="text-sm text-zinc-400">
            Get a personal link and share it anywhere — bio, chat, or story.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-2 font-semibold">AI-Suggested Questions</h3>
          <p className="text-sm text-zinc-400">
            Don't know what to ask? Let AI suggest engaging conversation starters.
          </p>
        </div>
      </div>
    </div>
  );
}