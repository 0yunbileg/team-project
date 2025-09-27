"use client";

import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProtectedRoute from "../ProtectedRoute";

export function Tasks() {
  const { user, updateUser } = useCurrentUser();
  const [title, setTitle] = useState("");

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  // Toggle task completion and update points
  const toggleTask = (id: number) => {
    if (!user) return;
    const updatedTasks = user.tasks.map((t) => {
      if (t.id === id) {
        const completed = !t.completed;
        // Add 10 points if marking as completed
        const points = completed ? user.points + 10 : user.points - 10;
        updateUser({ ...user, tasks: user.tasks.map(task => task.id === id ? { ...task, completed } : task), points });
        return { ...t, completed };
      }
      return t;
    });
  };

  // Add new task
  const addTask = () => {
    const t = title.trim();
    if (!t) return;
    const newTask = {
      id: Math.floor(Math.random() * 100000),
      title: t,
      completed: false,
      priority: "medium" as const,
    };
    updateUser({ ...user, tasks: [...user.tasks, newTask] });
    setTitle("");
  };

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Tasks</h3>
        <div className="flex items-center gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quick add task"
            className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/10 outline-none text-sm"
          />
          <button
            onClick={addTask}
            className="rounded-lg px-3 py-2 bg-violet-500/90 text-white text-sm flex items-center gap-2"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {user.tasks.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/10 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleTask(t.id)}
            />
            <span className={`text-sm ${t.completed ? "line-through opacity-60" : ""}`}>
              {t.title}
            </span>
            <span className="ml-auto text-xs opacity-60 capitalize">
              {t.priority}
            </span>
            {t.completed && <Check size={16} className="text-emerald-500" />}
          </label>
        ))}
      </div>
    </div>
  );
}
