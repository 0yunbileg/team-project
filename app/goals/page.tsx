"use client";

import { useEffect, useState } from "react";
import { HeroCard } from "@/components/HeroCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { loadData, saveData } from "@/lib/storage";
import type { DashboardData, Goal } from "@/lib/types";

export default function GoalsPage() {
  const [data, setData] = useState<DashboardData>({ goals: [], habits: [], tasks: [] });
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    setData(loadData());
  }, []);

  function addGoal() {
    if (!title.trim()) return;
    if (data.goals.length >= 3) return;
    const g: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      target: 100,
      progress: 0,
      targetDate: targetDate || undefined,
    };
    const next = { ...data, goals: [...data.goals, g] };
    setData(next);
    saveData(next);
    setTitle("");
    setTargetDate("");
  }

  function removeGoal(id: string) {
    const next = { ...data, goals: data.goals.filter((g) => g.id !== id) };
    setData(next);
    saveData(next);
  }

  function updateTitle(id: string, v: string) {
    const next = {
      ...data,
      goals: data.goals.map((g) => (g.id === id ? { ...g, title: v } : g)),
    };
    setData(next);
    saveData(next);
  }

  function updateTargetDate(id: string, v: string) {
    const next = {
      ...data,
      goals: data.goals.map((g) => (g.id === id ? { ...g, targetDate: v || undefined } : g)),
    };
    setData(next);
    saveData(next);
  }

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
      <HeroCard
        title="Your Goals"
        subtitle="Create up to 3 long-term goals to guide your habits"
        rightSlot={<ThemeToggle />}
      >
        <div className="grid gap-3 sm:flex sm:items-end">
          <div>
            <label className="text-xs opacity-70">Goal title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Run a marathon"
              className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
            />
          </div>
          <div>
            <label className="text-xs opacity-70">Target date (optional)</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
            />
          </div>
          <button
            onClick={addGoal}
            disabled={!title.trim() || data.goals.length >= 3}
            className="h-10 px-4 rounded-md bg-violet-500/90 text-white disabled:opacity-50"
          >
            Add Goal
          </button>
        </div>
      </HeroCard>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.goals.map((g) => (
          <div key={g.id} className="card-blur rounded-xl p-4 space-y-2">
            <input
              value={g.title}
              onChange={(e) => updateTitle(g.id, e.target.value)}
              className="w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
            />
            <div className="text-xs opacity-70">Target date</div>
            <input
              type="date"
              value={g.targetDate || ""}
              onChange={(e) => updateTargetDate(g.id, e.target.value)}
              className="w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
            />
            <div className="flex justify-between items-center pt-1">
              <div className="text-xs opacity-70">Progress: {g.progress}/{g.target}</div>
              <button onClick={() => removeGoal(g.id)} className="text-red-500 text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
