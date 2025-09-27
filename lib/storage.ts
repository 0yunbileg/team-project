"use client";

import { User } from "@/types/user";

// --- User storage ---
const USERS_KEY = "pusers:data:v1";
const CURRENT_USER_KEY = "pcurrent:user";

export function getUser(email: string): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return null;
  const users: User[] = JSON.parse(raw);
  return users.find(u => u.email === email) || null;
}

export function updateUser(updated: User) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(USERS_KEY);
  const users: User[] = raw ? JSON.parse(raw) : [];
  const idx = users.findIndex(u => u.email === updated.email);
  if (idx !== -1) users[idx] = updated;
  else users.push(updated);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function setCurrentUser(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, email);
}

export function getCurrentUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_USER_KEY);
}

// --- Dashboard storage ---
export const DASHBOARD_KEY = "pdashboard:data:v1";

export interface DashboardData {
  goals: { id: string; title: string; target: number; progress: number }[];
  habits: { id: string; title: string; streak: number; history: Record<string, any> }[];
  tasks: { id: string; title: string; priority: string; completed: boolean }[];
}

const demoData: DashboardData = {
  goals: [],
  habits: [],
  tasks: [],
};

export function loadData(): DashboardData {
  if (typeof window === "undefined") return demoData;
  const raw = localStorage.getItem(DASHBOARD_KEY);
  return raw ? JSON.parse(raw) : demoData;
}

export function saveData(data: DashboardData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DASHBOARD_KEY, JSON.stringify(data));
}
