"use client";

import { useMemo, useState } from "react";
import { saveMoodEntries, loadMoodEntries } from "@/lib/storage";
import type { MoodEntry } from "@/lib/types";
import { motion } from "framer-motion";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function DailyLog({ habits, onSaved }: { habits: string[]; onSaved?: () => void }) {
  const entries = loadMoodEntries();
  const existing = entries.find((e) => e.dateISO === todayISO());
  const [mood, setMood] = useState<number>(existing?.mood ?? 7);
  const [checked, setChecked] = useState<string[]>(existing?.habitsChecked ?? []);
  const [note, setNote] = useState<string>(existing?.note ?? "");

  function toggle(h: string) {
    setChecked((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));
  }

  function save() {
    const id = existing?.id ?? Math.random().toString(36).slice(2);
    const entry: MoodEntry = {
      id,
      dateISO: todayISO(),
      mood: Math.max(1, Math.min(10, mood)),
      habitsChecked: checked,
      note: note.trim() || undefined,
    };
    const next = existing
      ? entries.map((e) => (e.id === id ? entry : e))
      : [...entries, entry];
    saveMoodEntries(next);
    onSaved?.();
  }

  const moodLabel = useMemo(() => {
    if (mood >= 9) return "Ecstatic";
    if (mood >= 7) return "Great";
    if (mood >= 5) return "Okay";
    if (mood >= 3) return "Low";
    return "Rough";
  }, [mood]);

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Today's Log</h3>
        <span className="text-xs text-black/60 dark:text-white/60">{todayISO()}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-sm mb-2">Mood: <span className="opacity-80">{mood} / 10</span> <span className="opacity-60">· {moodLabel}</span></div>
          <input
            type="range"
            min={1}
            max={10}
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="mt-3 text-xs opacity-70">Tip: aim for consistency, not perfection.</div>
        </div>

        <div>
          <div className="text-sm mb-2">Habits</div>
          <div className="grid grid-cols-2 gap-2">
            {habits.map((h) => (
              <label key={h} className="flex items-center gap-2 rounded-lg p-2 bg-black/5 dark:bg-white/10 cursor-pointer text-sm">
                <input type="checkbox" checked={checked.includes(h)} onChange={() => toggle(h)} />
                <span>{h}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm mb-2">Note</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="One line reflection..."
          className="w-full rounded-lg p-3 bg-black/5 dark:bg-white/10 outline-none text-sm"
          rows={3}
        />
      </div>

      <motion.button
        onClick={save}
        whileTap={{ scale: 0.98 }}
        className="mt-4 rounded-lg px-4 py-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-sky-400 text-white text-sm"
      >
        Save Today's Log
      </motion.button>
    </div>
  );
}
