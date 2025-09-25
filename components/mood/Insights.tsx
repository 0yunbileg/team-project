"use client";

import type { MoodEntry } from "@/lib/types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ScatterChart, Scatter } from "recharts";

function avg(nums: number[]) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

export function Insights({ entries, habits }: { entries: MoodEntry[]; habits: string[] }) {
  const byHabit = habits.map((h) => {
    const yes = entries.filter((e) => e.habitsChecked.includes(h)).map((e) => e.mood);
    const no = entries.filter((e) => !e.habitsChecked.includes(h)).map((e) => e.mood);
    const avgYes = avg(yes);
    const avgNo = avg(no);
    const delta = +(avgYes - avgNo).toFixed(2);
    return { name: h, avgYes: +avgYes.toFixed(2), avgNo: +avgNo.toFixed(2), delta };
  });

  const scatter = entries.map((e, i) => ({ x: e.habitsChecked.length, y: e.mood, i }));

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Insights</h3>
        <span className="text-xs text-black/60 dark:text-white/60">Correlation preview</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64">
          <h4 className="text-sm mb-2 opacity-80">Mood delta when habit is checked</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byHabit.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
              <YAxis width={24} tick={{ fill: "currentColor", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#111827", border: "none" }} />
              <Bar dataKey="delta" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <h4 className="text-sm mb-2 opacity-80">Mood vs. habits checked</h4>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis type="number" dataKey="x" name="# habits" tick={{ fill: "currentColor", fontSize: 12 }} domain={[0, 10]} />
              <YAxis type="number" dataKey="y" name="mood" tick={{ fill: "currentColor", fontSize: 12 }} domain={[1, 10]} />
              <Tooltip cursor={{ stroke: "#fff", strokeOpacity: 0.1 }} contentStyle={{ background: "#111827", border: "none" }} />
              <Scatter data={scatter} fill="#a78bfa" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
