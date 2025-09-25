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
