"use client";

import { Trophy, Flame, CheckCircle2 } from "lucide-react";

export function KPICards({
  goalsCompleted,
  currentStreak,
  tasksDone,
}: {
  goalsCompleted: number;
  currentStreak: number;
  tasksDone: number;
}) {
  const Item = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <div className="card-blur rounded-xl p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-black/5 dark:bg-white/10">{icon}</div>
      <div>
        <div className="text-xs text-black/60 dark:text-white/60">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Item icon={<Trophy size={18} />} label="Goals completed" value={goalsCompleted} />
      <Item icon={<Flame size={18} />} label="Best streak" value={`${currentStreak} days`} />
      <Item icon={<CheckCircle2 size={18} />} label="Tasks done" value={tasksDone} />
    </div>
  );
}
