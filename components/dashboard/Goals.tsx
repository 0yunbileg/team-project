"use client";

import { Progress } from "@/components/ui/progress";
import { Goal } from "@/lib/types";

export function Goals({ goals }: { goals: Goal[] }) {
  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Goals</h3>
        <span className="text-xs text-black/60 dark:text-white/60">{goals.length} total</span>
      </div>
      <div className="space-y-3">
        {goals.map((g) => {
          const pct = Math.round((g.progress / g.target) * 100);
          return (
            <div key={g.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{g.title}</span>
                <span className="text-black/60 dark:text-white/60">{pct}%</span>
              </div>
              <Progress value={pct} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
