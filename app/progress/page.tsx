"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroCard } from "@/components/HeroCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { loadData } from "@/lib/storage";
import type { DashboardData } from "@/lib/types";

function daysBack(n: number): string[] {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

function overallSuccessForDay(habits: DashboardData["habits"], iso: string): boolean {
  if (habits.length === 0) return false;
  return habits.every((h) => !!h.history?.[iso]);
}

function calcOverallStreak(habits: DashboardData["habits"]): number {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (overallSuccessForDay(habits, iso)) streak++;
    else break;
  }
  return streak;
}

export default function ProgressPage() {
  const [data, setData] = useState<DashboardData>({ goals: [], habits: [], tasks: [] });

  useEffect(() => {
    setData(loadData());
  }, []);

  const last28 = useMemo(() => daysBack(28), []);
  const streak = useMemo(() => calcOverallStreak(data.habits), [data.habits]);

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
      <HeroCard
        title="Progress"
        subtitle="Overall streak and a simple daily success calendar"
        rightSlot={<ThemeToggle />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl p-4 bg-black/5 dark:bg-white/10">
            <div className="text-xs opacity-70">Overall streak</div>
            <div className="text-2xl font-semibold">{streak} days</div>
          </div>
          <div className="rounded-xl p-4 bg-black/5 dark:bg-white/10 sm:col-span-2">
            <div className="text-xs opacity-70 mb-2">Last 28 days</div>
            <div className="grid grid-cols-7 gap-2">
              {last28.map((iso) => {
                const ok = overallSuccessForDay(data.habits, iso);
                return (
                  <div key={iso} className="aspect-square rounded-md text-[10px] flex items-center justify-center"
                    title={iso + (ok ? " — success" : " — fail")}
                    style={{
                      background: ok ? "rgba(16,185,129,0.8)" : "rgba(0,0,0,0.06)",
                      color: ok ? "white" : "inherit",
                    }}
                  >
                    {new Date(iso).getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </HeroCard>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.habits.map((h) => (
          <div key={h.id} className="card-blur rounded-xl p-4">
            <div className="font-medium">{h.title}</div>
            <div className="text-xs opacity-70">Streak: {h.streak} days</div>
          </div>
        ))}
      </div>
    </div>
  );
}
