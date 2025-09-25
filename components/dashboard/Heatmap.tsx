"use client";

import { motion } from "framer-motion";

export function Heatmap({
  data,
  title = "Last 28 days",
}: {
  data: number[]; // 0..5 intensity, length 28
  title?: string;
}) {
  const max = 5;
  const safe = (data || []).slice(0, 28);
  const weeks = 4;
  const days = 7;

  const bins = safe.length < 28 ? [...Array(28 - safe.length).fill(0), ...safe] : safe;

  function color(v: number) {
    const t = Math.max(0, Math.min(max, v)) / max;
    // gradient from subtle to bright violet-cyan
    return `linear-gradient(90deg, rgba(167,139,250,${0.15 + t * 0.6}), rgba(34,211,238,${0.15 + t * 0.6}))`;
  }

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Activity Heatmap</h3>
        <span className="text-xs text-black/60 dark:text-white/60">{title}</span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="grid grid-rows-7 gap-1">
            {Array.from({ length: days }).map((__, d) => {
              const idx = w * days + d;
              const v = bins[idx] ?? 0;
              return (
                <motion.div
                  key={d}
                  className="h-4 w-4 rounded-sm bg-black/10 dark:bg-white/10"
                  style={{ background: v > 0 ? color(v) : undefined }}
                  initial={{ opacity: 0, y: 4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.01 }}
                  title={`Day ${idx + 1}: ${v}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
