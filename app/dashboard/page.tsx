"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { KPICards } from "@/components/dashboard/KPICards";
import { Goals } from "@/components/dashboard/Goals";
import { Habits } from "@/components/dashboard/Habits";
import { Tasks } from "@/components/dashboard/Tasks";
import { Charts } from "@/components/dashboard/Charts";
import { DashboardData } from "@/lib/types";
import { loadData } from "@/lib/storage";

export default function DashboardPage() {
  const { user, updateUser } = useCurrentUser();
  const [data, setData] = useState<DashboardData>({
    goals: [],
    habits: [],
    tasks: [],
  });
  useEffect(() => {
    setData(loadData());
  }, []);

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  const goalsCompleted = data.goals.filter(
    (g) => g.progress >= g.target
  ).length;
  const bestStreak = Math.max(0, ...data.habits.map((h) => h.streak));
  const tasksDone = data.tasks.filter((t) => t.completed).length;

  return (
    <ProtectedRoute>
      <div>
        <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold gradient-text">
                Productivity Dashboard
              </h1>
              <p className="text-sm text-black/60 dark:text-white/60">
                Track goals, habits, and tasks
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="mt-6">
            <KPICards
              goalsCompleted={goalsCompleted}
              currentStreak={bestStreak}
              tasksDone={tasksDone}
            />
          </div>

          <div className="mt-6">
            <Charts />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <Goals goals={data.goals} />
            </div>
            <div className="lg:col-span-1">
              <Habits habits={data.habits} />
            </div>
            <div className="lg:col-span-1">
              <Tasks tasks={data.tasks} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
