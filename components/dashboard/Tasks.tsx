"use client";

import { Check, Plus } from "lucide-react";
import { Task } from "@/lib/types";
import { useState } from "react";
import { loadData, saveData } from "@/lib/storage";

export function Tasks({ tasks: initial }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initial);
  const [title, setTitle] = useState("");

  function toggle(id: string) {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      const data = loadData();
      saveData({ ...data, tasks: next });
      return next;
    });
  }

  function add() {
    const t = title.trim();
    if (!t) return;
    setTasks((prev) => {
      const created = { id: Math.random().toString(36).slice(2), title: t, priority: "medium", completed: false } as Task;
      const next = [created, ...prev];
      const data = loadData();
      saveData({ ...data, tasks: next });
      return next;
    });
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
          <button onClick={add} className="rounded-lg px-3 py-2 bg-violet-500/90 text-white text-sm flex items-center gap-2">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <label key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/10 cursor-pointer">
            <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />
            <span className={`text-sm ${t.completed ? "line-through opacity-60" : ""}`}>{t.title}</span>
            <span className="ml-auto text-xs opacity-60 capitalize">{t.priority}</span>
            {t.completed && <Check size={16} className="text-emerald-500" />}
          </label>
        ))}
      </div>
    </div>
  );
}
