"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { KPICards } from "@/components/dashboard/KPICards";
import { Goals } from "@/components/dashboard/Goals";
import { Habits } from "@/components/dashboard/Habits";
import { Tasks } from "@/components/dashboard/Tasks";
import { Charts } from "@/components/dashboard/Charts";
import { Radials } from "@/components/dashboard/Radials";
import { Heatmap } from "@/components/dashboard/Heatmap";
import { Pomodoro } from "@/components/dashboard/Pomodoro";
import { TimeLogView } from "@/components/dashboard/TimeLog";
import { DashboardData } from "@/lib/types";
import { loadData } from "@/lib/storage";
import { Flame, Medal, Sparkles, ArrowRight, Plus, Target } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<DashboardData>({ goals: [], habits: [], tasks: [] });

  useEffect(() => {
    setData(loadData());
  }, []);

  const goalsCompleted = data.goals.filter((g) => g.progress >= g.target).length;
  const bestStreak = Math.max(0, ...data.habits.map((h) => h.streak));
  const tasksDone = data.tasks.filter((t) => t.completed).length;

  const totalStreak = data.habits.reduce((sum, h) => sum + h.streak, 0);
  const greeting = getGreeting();
  const topHabit = useMemo(() => [...data.habits].sort((a, b) => b.streak - a.streak)[0], [data.habits]);
  const radialData = useMemo(
    () => data.goals.map((g) => ({ name: g.title, value: Math.round((g.progress / g.target) * 100) })),
    [data.goals]
  );
  const heatData = useMemo(() => {
    // build a lightweight synthetic 28-day activity series from habits & tasks
    const base = Array.from({ length: 28 }, (_, i) => (i % 7 === 0 ? 2 : 1));
    const boost = Math.min(5, Math.round((tasksDone / Math.max(1, data.tasks.length)) * 5));
    return base.map((v, i) => Math.min(5, v + (i % 5 === 0 ? boost : Math.floor((totalStreak % 5) / 2))));
  }, [tasksDone, data.tasks.length, totalStreak]);

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
              {greeting}, let’s level up your day
            </motion.h1>
            <motion.p
              className="mt-2 text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Track your goals, lock habits, and finish tasks. Animated progress, streaks, and rich charts built-in.
            </motion.p>

            <motion.div
              className="mt-5 flex items-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a href="#tasks" className="rounded-lg px-4 py-2 bg-violet-500/90 text-white text-sm inline-flex items-center gap-2">
                <Plus size={14} /> Quick add task
              </a>
              <a href="#goals" className="rounded-lg px-4 py-2 bg-black/5 dark:bg-white/10 text-sm inline-flex items-center gap-2">
                <Target size={14} /> Review goals
              </a>
              <a href="#charts" className="rounded-lg px-4 py-2 bg-black/5 dark:bg-white/10 text-sm inline-flex items-center gap-2">
                Insights <ArrowRight size={14} />
              </a>
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
              <div className="font-semibold">{bestStreak} days{topHabit ? ` — ${topHabit.title}` : ""}</div>
            </div>
          </div>
          <div className="rounded-xl p-4 bg-black/5 dark:bg-white/10 flex items-center gap-3">
            <Sparkles className="text-violet-400" size={18} />
            <div>
              <div className="text-xs opacity-60">Goals completed</div>
              <div className="font-semibold">{goalsCompleted}</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div id="kpis" className="mt-6">
        <KPICards goalsCompleted={goalsCompleted} currentStreak={bestStreak} tasksDone={tasksDone} />
      </div>

      <div id="charts" className="mt-6">
        <Charts />
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-2">
          <Radials data={radialData} />
        </div>
        <div className="xl:col-span-2">
          <Heatmap data={heatData} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 card-blur rounded-xl p-6 flex items-center justify-between overflow-hidden relative">
          <div>
            <div className="text-sm text-black/60 dark:text-white/60">Deep work</div>
            <div className="text-2xl font-semibold">Focus Mode</div>
            <p className="mt-1 text-sm opacity-80 max-w-md">Hide distractions and get in the zone. Timer, sound cues, and gentle progress animations included.</p>
            <a href="/dashboard/focus" className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-sky-400 text-white text-sm">
              Enter Focus
            </a>
          </div>
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-violet-400/50 via-cyan-300/40 to-sky-400/40" />
        </div>
        <div>
          <Pomodoro />
        </div>
      </div>

      <div className="mt-6">
        <TimeLogView />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div id="goals" className="lg:col-span-1">
          <Goals goals={data.goals} />
        </div>
        <div className="lg:col-span-1">
          <Habits habits={data.habits} />
        </div>
        <div id="tasks" className="lg:col-span-1">
          <Tasks tasks={data.tasks} />
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Up early";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Late night mode";
}
