"use client";

import { DashboardData, MoodEntry, MediaData, TimeLog, FeedbackEntry } from "./types";

const BASE_KEY = "pdashboard:data:v1";
const MOOD_KEY = "pdashboard:mood:v1";
const MEDIA_KEY = "pdashboard:media:v1";
const LOG_KEY = "pdashboard:logs:v1";
const FEEDBACK_KEY = "pdashboard:feedback:v1";

function keyFor(base: string) {
  if (typeof window === "undefined") return base;
  try {
    const email = localStorage.getItem("currentUser");
    return email ? `${base}:${email}` : base;
  } catch {
    return base;
  }
}

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
    const raw = localStorage.getItem(keyFor(BASE_KEY));
    return raw ? (JSON.parse(raw) as DashboardData) : demoData;
  } catch {
    return demoData;
  }
}

export function saveData(data: DashboardData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(keyFor(BASE_KEY), JSON.stringify(data));
  } catch {}
}

// Mood Journal storage
const demoMood: MoodEntry[] = [
  { id: "m1", dateISO: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10), mood: 6, habitsChecked: ["Meditate"], note: "OK day" },
  { id: "m2", dateISO: new Date(Date.now() - 86400000).toISOString().slice(0, 10), mood: 8, habitsChecked: ["Workout", "Journal"], note: "Felt productive" },
];

export function loadMoodEntries(): MoodEntry[] {
  if (typeof window === "undefined") return demoMood;
  try {
    const raw = localStorage.getItem(MOOD_KEY);
    return raw ? (JSON.parse(raw) as MoodEntry[]) : demoMood;
  } catch {
    return demoMood;
  }
}

export function saveMoodEntries(entries: MoodEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOOD_KEY, JSON.stringify(entries));
  } catch {}
}

// Media Tracker storage
const demoMedia: MediaData = {
  items: [
    { id: "b1", type: "book", title: "Atomic Habits", authorOrSource: "James Clear", status: "in_progress", page: 52, totalPages: 300, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "a1", type: "article", title: "Systems over Goals", authorOrSource: "Scott Adams", url: "https://example.com", status: "to_start", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "p1", type: "podcast", title: "Deep Work Tactics", authorOrSource: "Focus FM", status: "finished", position: "35:10", notes: "Batch similar tasks, set shallow work boundaries.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  quotes: [
    { id: "q1", sourceId: "b1", sourceTitle: "Atomic Habits", text: "You do not rise to the level of your goals, you fall to the level of your systems.", createdAt: new Date().toISOString() },
  ],
};

export function loadMediaData(): MediaData {
  if (typeof window === "undefined") return demoMedia;
  try {
    const raw = localStorage.getItem(MEDIA_KEY);
    return raw ? (JSON.parse(raw) as MediaData) : demoMedia;
  } catch {
    return demoMedia;
  }
}

export function saveMediaData(data: MediaData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MEDIA_KEY, JSON.stringify(data));
  } catch {}
}

// Time Logs storage (per-user)
export function loadTimeLogs(): TimeLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(keyFor(LOG_KEY));
    return raw ? (JSON.parse(raw) as TimeLog[]) : [];
  } catch {
    return [];
  }
}

export function saveTimeLogs(logs: TimeLog[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(keyFor(LOG_KEY), JSON.stringify(logs));
  } catch {}
}

// Feedback storage (front-end only)
export function loadFeedback(): FeedbackEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? (JSON.parse(raw) as FeedbackEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveFeedback(entries: FeedbackEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries));
  } catch {}
}
