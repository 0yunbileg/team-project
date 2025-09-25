"use client";

import type { MoodEntry } from "@/lib/types";

function dayLabel(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function WeekStrip({ entries }: { entries: MoodEntry[] }) {
  // expects last 7 entries or less; we'll map to 7 days ending today
  const map = new Map(entries.map((e) => [e.dateISO, e]));
  const days: { dateISO: string; mood?: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const iso = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const e = map.get(iso);
    days.push({ dateISO: iso, mood: e?.mood });
  }

  function color(m?: number) {
    if (!m) return "bg-black/10 dark:bg-white/10";
    if (m >= 9) return "bg-gradient-to-r from-fuchsia-400 to-amber-300";
    if (m >= 7) return "bg-gradient-to-r from-violet-400 to-cyan-300";
    if (m >= 5) return "bg-cyan-300/40";
    if (m >= 3) return "bg-amber-300/40";
    return "bg-rose-400/40";
  }

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">This Week</h3>
        <span className="text-xs text-black/60 dark:text-white/60">Mood overview</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => (
          <div key={d.dateISO} className="text-center">
            <div className={`h-8 rounded ${color(d.mood)} border border-black/5 dark:border-white/5`} />
            <div className="text-[10px] mt-1 opacity-60">{dayLabel(d.dateISO)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
