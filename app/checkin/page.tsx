"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroCard } from "@/components/HeroCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { loadData, saveData } from "@/lib/storage";
import type { DashboardData, Habit } from "@/lib/types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function calcStreak(history: Record<string, boolean>): number {
  // Count consecutive days from today backwards while done === true
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (history[iso]) streak++;
    else break;
  }
  return streak;
}

export default function CheckinPage() {
  const [data, setData] = useState<DashboardData>({
    goals: [],
    habits: [],
    tasks: [],
  });
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    setData(loadData());
  }, []);

  const limitReached = data.habits.length >= 5;
  const today = todayISO();
  const allDoneToday = useMemo(() => {
    if (data.habits.length === 0) return false;
    return data.habits.every((h) => !!h.history?.[today]);
  }, [data.habits, today]);

  function addHabit() {
    if (!newHabit.trim() || limitReached) return;
    const h: Habit = {
      id: crypto.randomUUID(),
      title: newHabit.trim(),
      streak: 0,
      history: {},
    };
    const next = { ...data, habits: [...data.habits, h] };
    setData(next);
    saveData(next);
    setNewHabit("");
  }

  function removeHabit(id: string) {
    const next = { ...data, habits: data.habits.filter((h) => h.id !== id) };
    setData(next);
    saveData(next);
  }

  function toggleToday(habitId: string) {
    const nextHabits = data.habits.map((h) => {
      if (h.id !== habitId) return h;
      const history = { ...(h.history || {}) };
      history[today] = !history[today];
      const streak = calcStreak(history);
      return { ...h, history, streak };
    });
    const next = { ...data, habits: nextHabits };
    setData(next);
    saveData(next);
  }

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
      <HeroCard
        title="Daily Check-in"
        subtitle="Link habits to your goals and mark today's progress"
        rightSlot={<ThemeToggle />}
      >
        <div className="grid gap-3 sm:flex sm:items-end">
          <div>
            <label className="text-xs opacity-70">New habit</label>
            <input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="e.g., Write 500 words"
              className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
            />
          </div>
          <button
            onClick={addHabit}
            disabled={!newHabit.trim() || limitReached}
            className="h-10 px-4 rounded-md bg-violet-500/90 text-white disabled:opacity-50"
          >
            Add Habit ({data.habits.length}/5)
          </button>
          <div className="text-sm opacity-80">
            Overall today: {allDoneToday ? "Success" : "Pending"}
          </div>
        </div>
      </HeroCard>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.habits.map((h) => {
          const done = !!h.history?.[today];
          return (
            <div key={h.id} className="card-blur rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{h.title}</div>
                  <div className="text-xs opacity-70">
                    Streak: {h.streak} days
                  </div>
                </div>
                <button
                  onClick={() => removeHabit(h.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => toggleToday(h.id)}
                  className={
                    "px-4 py-2 rounded-md text-sm " +
                    (done
                      ? "bg-emerald-500/90 text-white"
                      : "bg-black/5 dark:bg-white/10")
                  }
                >
                  {done ? "Done" : "Mark Done"}
                </button>
                <div className="text-xs opacity-70">Today: {today}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
