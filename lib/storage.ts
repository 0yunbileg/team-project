"use client";

import { DashboardData } from "./types";
import { User } from "@/types/user";

const DASHBOARD_KEY = "pdashboard:data:v1";
const USERS_KEY = "pusers:data:v1";
const CURRENT_USER_KEY = "pcurrent:user";

// --- Dashboard storage ---
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
    {
      id: "t1",
      title: "Design dashboard layout",
      priority: "high",
      completed: false,
    },
    {
      id: "t2",
      title: "Implement charts",
      priority: "medium",
      completed: false,
    },
    { id: "t3", title: "Polish dark mode", priority: "low", completed: true },
  ],
};

export function loadData(): DashboardData {
  if (typeof window === "undefined") return demoData;
  try {
    const raw = localStorage.getItem(DASHBOARD_KEY);
    return raw ? (JSON.parse(raw) as DashboardData) : demoData;
  } catch {
    return demoData;
  }
}

export function saveData(data: DashboardData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(data));
  } catch {}
}

// --- User storage for pets ---
export function getUser(email: string): User | null {
  console.log("Current user email:", localStorage.getItem("pcurrent:user"));
  console.log(
    "Users in storage:",
    JSON.parse(localStorage.getItem("pusers:data:v1") || "[]")
  );

  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return null;
    const users: User[] = JSON.parse(raw);
    return users.find((u) => u.email === email) || null; // <--- use email here
  } catch {
    return null;
  }
}

export function updateUser(updated: User) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users: User[] = raw ? JSON.parse(raw) : [];

    const idx = users.findIndex((u) => u.email === updated.email);
    if (idx !== -1) {
      users[idx] = updated;
    } else {
      users.push(updated);
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function setCurrentUser(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, email);
}

export function getCurrentUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_USER_KEY);
}
