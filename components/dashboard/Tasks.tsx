"use client";

import { Check, Plus, Trash2, Save } from "lucide-react";
import { Task } from "@/lib/types";
import { useMemo, useState } from "react";
import { loadData, saveData } from "@/lib/storage";

export function Tasks({ tasks: initial }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initial);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingEstimate, setEditingEstimate] = useState<string>("");

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
      const created: Task = {
        id: Math.random().toString(36).slice(2),
        title: t,
        description: description.trim() || undefined,
        estimateMinutes: estimate ? Math.max(0, Math.round(parseFloat(estimate))) : undefined,
        priority: "medium",
        completed: false,
      };
      const next = [created, ...prev];
      const data = loadData();
      saveData({ ...data, tasks: next });
      return next;
    });
    setTitle("");
    setDescription("");
    setEstimate("");
  }

  function remove(id: string) {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      const data = loadData();
      saveData({ ...data, tasks: next });
      return next;
    });
  }

  function startEdit(t: Task) {
    setEditingId(t.id);
    setEditingTitle(t.title);
    setEditingDescription(t.description || "");
    setEditingEstimate(t.estimateMinutes != null ? String(t.estimateMinutes) : "");
  }

  function saveEdit(id: string) {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: editingTitle.trim() || t.title,
              description: editingDescription.trim() || undefined,
              estimateMinutes: editingEstimate ? Math.max(0, Math.round(parseFloat(editingEstimate))) : undefined,
            }
          : t
      );
      const data = loadData();
      saveData({ ...data, tasks: next });
      return next;
    });
    setEditingId(null);
  }

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);

  function exportTasksCSV() {
    const headers = ["id","title","description","estimateMinutes","priority","completed"]; 
    const rows = tasks.map((t) => [
      t.id,
      JSON.stringify(t.title),
      JSON.stringify(t.description || ""),
      t.estimateMinutes ?? "",
      t.priority,
      t.completed,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();
    URL.revokeObjectURL(url);
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
            className="px-3 py-2 rounded-lg bg-black/5 dark:bg:white/10 outline-none text-sm"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/10 outline-none text-sm"
          />
          <input
            value={estimate}
            onChange={(e) => setEstimate(e.target.value)}
            placeholder="Est. min"
            type="number"
            min={0}
            className="w-24 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/10 outline-none text-sm"
          />
          <button onClick={add} className="rounded-lg px-3 py-2 bg-violet-500/90 text-white text-sm flex items-center gap-2">
            <Plus size={14} /> Add
          </button>
          <button onClick={exportTasksCSV} className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/10 text-sm flex items-center gap-2" title="Export tasks">
            <Save size={14} /> Export
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {activeTasks.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/10">
            <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />
            {editingId === t.id ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-sm" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} />
                <input className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-sm" value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} placeholder="Description" />
                <input className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-sm" value={editingEstimate} onChange={(e) => setEditingEstimate(e.target.value)} placeholder="Est. min" type="number" min={0} />
              </div>
            ) : (
              <div className="flex-1">
                <div className="text-sm font-medium">{t.title}</div>
                {(t.description || t.estimateMinutes != null) && (
                  <div className="text-xs opacity-70">
                    {t.description && <span>{t.description} </span>}
                    {t.estimateMinutes != null && <span>• Est: {t.estimateMinutes}m</span>}
                  </div>
                )}
              </div>
            )}
            <span className="text-xs opacity-60 capitalize">{t.priority}</span>
            {t.completed && <Check size={16} className="text-emerald-500" />}
            {editingId === t.id ? (
              <button onClick={() => saveEdit(t.id)} className="ml-2 rounded px-2 py-1 bg-violet-500/90 text-white text-xs">Save</button>
            ) : (
              <button onClick={() => startEdit(t)} className="ml-2 rounded px-2 py-1 bg-black/10 text-xs">Edit</button>
            )}
            <button onClick={() => remove(t.id)} className="ml-2 rounded px-2 py-1 bg-red-500/80 text-white text-xs flex items-center gap-1">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        ))}
        {activeTasks.length === 0 && (
          <div className="text-sm opacity-70">No active tasks. Completed tasks are hidden.</div>
        )}
      </div>
    </div>
  );
}
