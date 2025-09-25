"use client";

import { DashboardData } from "./types";

const KEY = "pdashboard:data:v1";

const demoData: DashboardData = {
  goals: [
    { id: "g1", title: "Read 12 books", target: 12, progress: 4 },
    { id: "g2", title: "Run 500 km", target: 500, progress: 130 },
    { id: "g3", title: "Ship 6 projects", target: 6, progress: 2 },
  ],
  habits: [
    { id: "h1", title: "Meditate", streak: 5, history: {} },
    { id: "h2", title: "Workout", streak: 12, history: {} },
    { id: "h3", title: "Journal", streak: 3, history: {} },
  ],
  tasks: [
    { id: "t1", title: "Design dashboard layout", priority: "high", completed: false },
    { id: "t2", title: "Implement charts", priority: "medium", completed: false },
    { id: "t3", title: "Polish dark mode", priority: "low", completed: true },
  ],
};

export function loadData(): DashboardData {
  if (typeof window === "undefined") return demoData;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DashboardData) : demoData;
  } catch {
    return demoData;
  }
}

export function saveData(data: DashboardData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}
