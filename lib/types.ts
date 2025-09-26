export type Goal = {
  id: string;
  title: string;
  target: number; // e.g., 100 (percent) or units
  progress: number; // 0..target
  targetDate?: string; // ISO date, optional
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
  description?: string;
  estimateMinutes?: number; // user's estimate for the task
  due?: string; // ISO date
  priority: "low" | "medium" | "high";
  completed: boolean;
};

export type DashboardData = {
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
};

// Time tracking
export type TimeLog = {
  id: string;
  taskId?: string; // optional for ad-hoc focus with no task selected
  taskTitle: string; // snapshot of the title when logged
  estimateMinutes?: number; // snapshot of estimate at the time
  startedAt: string; // ISO timestamp
  endedAt: string; // ISO timestamp
  actualSeconds: number; // duration in seconds
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

// Feedback (front-end only)
export type FeedbackEntry = {
  id: string;
  message: string;
  createdAt: string; // ISO
};
