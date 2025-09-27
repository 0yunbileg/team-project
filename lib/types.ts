import { Task } from "@/types/user";

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

export type DashboardData = {
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
};
