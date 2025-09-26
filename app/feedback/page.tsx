"use client";

import { useEffect, useState } from "react";
import { HeroCard } from "@/components/HeroCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { loadFeedback, saveFeedback } from "@/lib/storage";
import type { FeedbackEntry } from "@/lib/types";

export default function FeedbackPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEntries(loadFeedback());
  }, []);

  function submit() {
    if (!message.trim()) return;
    const next = [
      { id: crypto.randomUUID(), message: message.trim(), createdAt: new Date().toISOString() },
      ...entries,
    ];
    setEntries(next);
    saveFeedback(next);
    setMessage("");
  }

  function remove(id: string) {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveFeedback(next);
  }

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
      <HeroCard
        title="Feedback"
        subtitle="Tell us what works and what you'd like next"
        rightSlot={<ThemeToggle />}
      >
        <div className="grid gap-3 sm:flex sm:items-end">
          <div className="flex-1">
            <label className="text-xs opacity-70">Your message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Feature requests, bugs, or ideas..."
              rows={3}
              className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
            />
          </div>
          <button
            onClick={submit}
            disabled={!message.trim()}
            className="h-10 px-4 rounded-md bg-violet-500/90 text-white disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </HeroCard>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((e) => (
          <div key={e.id} className="card-blur rounded-xl p-4">
            <div className="text-xs opacity-60">{new Date(e.createdAt).toLocaleString()}</div>
            <div className="mt-1 whitespace-pre-wrap">{e.message}</div>
            <div className="mt-2 text-right">
              <button onClick={() => remove(e.id)} className="text-sm text-red-500">Remove</button>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-sm opacity-70">No feedback yet. Be the first!</div>
        )}
      </div>
    </div>
  );
}
