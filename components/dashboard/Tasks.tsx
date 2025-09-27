"use client";

import { Check, Plus } from "lucide-react";
import { Task } from "@/types/user";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProtectedRoute from "../ProtectedRoute";

export function Tasks({ tasks: initial }: { tasks: Task[] }) {
  const [title, setTitle] = useState("");
  const { user, updateUser } = useCurrentUser();
  const [, setForceUpdate] = useState(0); // for force re-render

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  function toggle(id: number) {
    if (!user) return;

    let pointsToAdd = 0;
    const updatedTasks = user.tasks.map((t) => {
      if (t.id === id) {
        // Only add points if task is being completed
        if (!t.completed) pointsToAdd = 10;
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    const updatedUser = { ...user, tasks: updatedTasks, points: user.points + pointsToAdd };
    updateUser(updatedUser);
    setForceUpdate((n) => n + 1);
  }

  function add() {
    const t = title.trim();
    if (!t || !user) return;

    const newTask: Task = {
      id: Date.now(), // safer unique id
      title: t,
      priority: "medium",
      completed: false,
    };

    const updatedUser = { ...user, tasks: [...user.tasks, newTask] };
    updateUser(updatedUser);
    setForceUpdate((n) => n + 1);
    setTitle("");
  }

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
            onClick={add}
            className="rounded-lg px-3 py-2 bg-violet-500/90 text-white text-sm flex items-center gap-2"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {user.tasks.length === 0 && <p className="text-gray-400">No tasks yet</p>}
        {user.tasks.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/10 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggle(t.id)}
            />
            <span className={`text-sm ${t.completed ? "line-through opacity-60" : ""}`}>
              {t.title}
            </span>
            <span className="ml-auto text-xs opacity-60 capitalize">{t.priority}</span>
            {t.completed && <Check size={16} className="text-emerald-500" />}
          </label>
        ))}
      </div>
    </div>
  );
}
