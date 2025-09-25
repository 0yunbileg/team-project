"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { KPICards } from "@/components/dashboard/KPICards";
import { Goals } from "@/components/dashboard/Goals";
import { Habits } from "@/components/dashboard/Habits";
import { Tasks } from "@/components/dashboard/Tasks";
import { Charts } from "@/components/dashboard/Charts";
import { DashboardData, Habit } from "@/lib/types";
import { loadData } from "@/lib/storage";
import { Flame, Medal, Sparkles } from "lucide-react";

export default function LifeTrackerPage() {
  const [data, setData] = useState<DashboardData>({ goals: [], habits: [], tasks: [] });

  useEffect(() => {
    setData(loadData());
  }, []);

  const goalsCompleted = data.goals.filter((g) => g.progress >= g.target).length;
  const bestStreak = Math.max(0, ...data.habits.map((h) => h.streak));
  const tasksDone = data.tasks.filter((t) => t.completed).length;

  const totalStreak = data.habits.reduce((sum, h) => sum + h.streak, 0);

  const achievements = useMemo(() => buildAchievements(data.habits), [data.habits]);

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl card-blur p-6 sm:p-10">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-violet-400/50 via-cyan-300/40 to-sky-400/40" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full blur-3xl opacity-30 bg-gradient-to-bl from-fuchsia-400/40 via-rose-300/30 to-amber-200/30" />

        <div className="flex items-start justify-between gap-6 relative">
          <div>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-semibold gradient-text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Life Tracker
            </motion.h1>
            <motion.p
              className="mt-2 text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Хэрэглэгч goals, habits, tasks-ийг track хийнэ. Charts & graphs, animated progress,
              daily streaks, badges, dark mode — бүхнийг нэг дор.
            </motion.p>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <KPICards goalsCompleted={goalsCompleted} currentStreak={bestStreak} tasksDone={tasksDone} />
            </motion.div>
          </div>

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* Streak summary */}
        <motion.div
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="rounded-xl p-4 bg-black/5 dark:bg-white/10 flex items-center gap-3">
            <Flame className="text-orange-500" size={18} />
            <div>
              <div className="text-xs opacity-60">Combined streak</div>
              <div className="font-semibold">{totalStreak} days</div>
            </div>
          </div>
          <div className="rounded-xl p-4 bg-black/5 dark:bg-white/10 flex items-center gap-3">
            <Medal className="text-amber-400" size={18} />
            <div>
              <div className="text-xs opacity-60">Best habit streak</div>
              <div className="font-semibold">{bestStreak} days</div>
            </div>
          </div>
          <div className="rounded-xl p-4 bg-black/5 dark:bg-white/10 flex items-center gap-3">
            <Sparkles className="text-violet-400" size={18} />
            <div>
              <div className="text-xs opacity-60">Achievements unlocked</div>
              <div className="font-semibold">{achievements.length}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="mt-8">
        <Charts />
      </div>

      {/* Main sections */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Goals goals={data.goals} />
          <Habits habits={data.habits} />
        </div>

        <div className="xl:col-span-2 space-y-4">
          <Tasks tasks={data.tasks} />
          <AchievementsCard items={achievements} />
        </div>
      </div>
    </div>
  );
}

function buildAchievements(habits: Habit[]) {
  const items: { id: string; title: string; desc: string; emoji: string }[] = [];
  const best = Math.max(0, ...habits.map((h) => h.streak));
  const total = habits.reduce((s, h) => s + h.streak, 0);

  if (best >= 7) items.push({ id: "a1", title: "Rising Star", desc: "7+ day streak on a habit", emoji: "⭐" });
  if (best >= 14) items.push({ id: "a2", title: "On Fire", desc: "14+ day streak", emoji: "🔥" });
  if (best >= 30) items.push({ id: "a3", title: "Legend", desc: "30+ day streak", emoji: "🏆" });
  if (total >= 21) items.push({ id: "a4", title: "Consistency", desc: "21 total streak days across habits", emoji: "🎯" });
  if (habits.length >= 3) items.push({ id: "a5", title: "Habit Builder", desc: "Track 3+ habits", emoji: "🧱" });

  return items;
}

function AchievementsCard({
  items,
}: {
  items: { id: string; title: string; desc: string; emoji: string }[];
}) {
  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Achievements</h3>
        <span className="text-xs text-black/60 dark:text-white/60">{items.length} unlocked</span>
      </div>
      {items.length === 0 ? (
        <div className="text-sm opacity-70">Keep going — achievements will appear as your streaks grow!</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((a, i) => (
            <motion.li
              key={a.id}
              className="rounded-lg p-3 bg-black/5 dark:bg-white/10"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <div className="text-xl leading-none">{a.emoji}</div>
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs opacity-70">{a.desc}</div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
