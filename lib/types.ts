export type Goal = {
  id: string;
  title: string;
  target: number; // e.g., 100 (percent) or units
  progress: number; // 0..target
};

export type Habit = {
  id: string;
  title: string;
  streak: number; // current streak in days
  history: Record<string, boolean>; // ISO date -> done
};

export type Task = {
  id: string;
  title: string;
  due?: string; // ISO date
  priority: "low" | "medium" | "high";
  completed: boolean;
};

export type DashboardData = {
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
};

// Mood Journal types
export type MoodEntry = {
  id: string;
  dateISO: string; // YYYY-MM-DD
  mood: number; // 1..10
  habitsChecked: string[]; // ids from Habit or free-form labels
  note?: string;
};

// Second Brain Media Tracker types
export type MediaType = "book" | "article" | "podcast" | "course" | "documentary";
export type MediaStatus = "to_start" | "in_progress" | "finished";

export type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  authorOrSource?: string;
  coverUrl?: string;
  url?: string; // external link
  status: MediaStatus;
  // progress helpers
  page?: number; // current page
  totalPages?: number;
  position?: string; // e.g., "52:30" for podcasts
  notes?: string; // key takeaways (required when finished via UI)
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type Quote = {
  id: string;
  sourceId: string; // MediaItem.id
  sourceTitle: string;
  text: string;
  createdAt: string;
};

export type MediaData = {
  items: MediaItem[];
  quotes: Quote[];
};
