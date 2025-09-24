"use client";

import { Flame } from "lucide-react";
import { Habit } from "@/lib/types";

function badgeForStreak(streak: number) {
  if (streak >= 30) return "🏆 Legend";
  if (streak >= 14) return "🔥 On Fire";
  if (streak >= 7) return "⭐ Rising";
  return "🌱 New";
}

export function Habits({ habits }: { habits: Habit[] }) {
  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Habits</h3>
        <span className="text-xs text-black/60 dark:text-white/60">Daily streaks & badges</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {habits.map((h) => (
          <div key={h.id} className="rounded-lg p-3 bg-black/5 dark:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="font-medium">{h.title}</div>
              <div className="text-xs opacity-70">{badgeForStreak(h.streak)}</div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Flame size={16} className="text-orange-500" />
              <span>{h.streak} day streak</span>
            </div>
            {/* simple mini-grid for 14 days */}
            <div className="mt-3 grid grid-cols-7 sm:grid-cols-[repeat(14,minmax(0,1fr))] gap-1 text-[0]">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 rounded ${i < Math.min(14, h.streak) ? "bg-violet-400" : "bg-black/10 dark:bg-white/10"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
