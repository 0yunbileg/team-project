"use client";

import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DailyLog } from "@/components/mood/DailyLog";
import { WeekStrip } from "@/components/mood/WeekStrip";
import { Insights } from "@/components/mood/Insights";
import { loadData, loadMoodEntries } from "@/lib/storage";
import type { MoodEntry } from "@/lib/types";

export default function MoodPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [habits, setHabits] = useState<string[]>([]);

  useEffect(() => {
    setEntries(loadMoodEntries());
    const data = loadData();
    setHabits(data.habits.map((h) => h.title));
  }, []);

  const last7 = useMemo(() => {
    const byDate = new Map(entries.map((e) => [e.dateISO, e]));
    const days: MoodEntry[] = [];
    for (let i = 6; i >= 0; i--) {
      const iso = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const e = byDate.get(iso);
      if (e) days.push(e);
    }
    return days;
  }, [entries]);

  function refresh() {
    setEntries(loadMoodEntries());
  }

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold gradient-text">Mood Journal</h1>
          <p className="text-sm text-black/60 dark:text-white/60">Daily habits + mood with correlation insights</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <DailyLog habits={habits} onSaved={refresh} />
        </div>
        <div>
          <WeekStrip entries={last7} />
        </div>
      </div>

      <div className="mt-6">
        <Insights entries={entries} habits={habits} />
      </div>
    </div>
  );
}
