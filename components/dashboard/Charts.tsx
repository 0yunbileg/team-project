"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { useCurrentUser, Task } from "@/hooks/useCurrentUser";

// Helper to get day of week string from a date (0=Sun, 1=Mon, ...)
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeeklyTaskData(tasks: Task[]) {
  // Initialize counts for each day
  const week = dayNames.map((d) => ({ d, tasks: 0, habits: 0 }));
  // If no 'due' property, distribute by id for demo
  tasks.forEach((task: Task) => {
    if (task.completed) {
      // Spread tasks across days using id for demo
      const day = typeof task.id === "number" ? task.id % 7 : 0;
      week[day].tasks++;
    }
  });
  return week;
}

export function Charts() {
  const { user } = useCurrentUser();
  // Fallback to empty array if user or user.tasks is not loaded
  const weekly =
    user && user.tasks
      ? getWeeklyTaskData(user.tasks)
      : dayNames.map((d) => ({ d, tasks: 0, habits: 0 }));
  return (
    <div className="card-blur rounded-xl p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-56">
        <h3 className="font-semibold mb-2">Habits per day</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weekly}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="d"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ stroke: "#fff", strokeOpacity: 0.1 }}
              contentStyle={{ background: "#111827", border: "none" }}
            />
            <Area
              type="monotone"
              dataKey="habits"
              stroke="#a78bfa"
              fill="url(#grad1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="h-56">
        <h3 className="font-semibold mb-2">Tasks completed</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weekly}>
            <XAxis
              dataKey="d"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ stroke: "#fff", strokeOpacity: 0.1 }}
              contentStyle={{ background: "#111827", border: "none" }}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
