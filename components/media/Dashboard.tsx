"use client";

import type { MediaData } from "@/lib/types";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#a78bfa", "#22d3ee", "#38bdf8", "#f472b6", "#34d399"]; 

export function MediaDashboard({ data }: { data: MediaData }) {
  const byType = Object.entries(
    data.items.reduce((acc: Record<string, number>, i) => {
      acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const kpis = {
    total: data.items.length,
    finished: data.items.filter((i) => i.status === "finished").length,
    inProgress: data.items.filter((i) => i.status === "in_progress").length,
    toStart: data.items.filter((i) => i.status === "to_start").length,
  };

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Progress Dashboard</h3>
        <span className="text-xs text-black/60 dark:text-white/60">By category & status</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byType} dataKey="value" nameKey="name" outerRadius={90} label>
                {byType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#111827", border: "none" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          <KPI label="Total" value={kpis.total} />
          <KPI label="Finished" value={kpis.finished} />
          <KPI label="In Progress" value={kpis.inProgress} />
          <KPI label="To Start" value={kpis.toStart} />
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl p-4 bg-black/5 dark:bg-white/10">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
