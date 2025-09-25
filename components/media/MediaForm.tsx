"use client";

import { useState } from "react";
import type { MediaItem, MediaType, MediaStatus, MediaData } from "@/lib/types";
import { saveMediaData, loadMediaData } from "@/lib/storage";
import { motion } from "framer-motion";

const types: MediaType[] = ["book", "article", "podcast", "course", "documentary"];
const statuses: MediaStatus[] = ["to_start", "in_progress", "finished"];

export function MediaForm({ onAdded }: { onAdded?: (item: MediaItem) => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<MediaType>("book");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<MediaStatus>("to_start");
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");

  function add() {
    const t = title.trim();
    if (!t) return;
    if (status === "finished" && !notes.trim()) {
      alert("Please add key takeaways/notes to finish this item.");
      return;
    }
    const now = new Date().toISOString();
    const item: MediaItem = {
      id: Math.random().toString(36).slice(2),
      type,
      title: t,
      authorOrSource: author.trim() || undefined,
      url: url.trim() || undefined,
      status,
      totalPages: totalPages || undefined,
      page: page || undefined,
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    const data = loadMediaData();
    const next: MediaData = { ...data, items: [item, ...data.items] };
    saveMediaData(next);
    onAdded?.(item);
    // reset
    setTitle("");
    setAuthor("");
    setUrl("");
    setStatus("to_start");
    setTotalPages(undefined);
    setPage(undefined);
    setNotes("");
  }

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Add Media</h3>
        <span className="text-xs text-black/60 dark:text-white/60">Second Brain</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm opacity-80">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg p-2 bg-black/5 dark:bg-white/10 outline-none text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm opacity-80">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as MediaType)} className="w-full rounded-lg p-2 bg-black/5 dark:bg-white/10 text-sm">
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm opacity-80">Author/Source</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-lg p-2 bg-black/5 dark:bg-white/10 outline-none text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm opacity-80">URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="w-full rounded-lg p-2 bg-black/5 dark:bg-white/10 outline-none text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm opacity-80">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as MediaStatus)} className="w-full rounded-lg p-2 bg-black/5 dark:bg-white/10 text-sm">
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm opacity-80">Total pages (if applicable)</label>
          <input type="number" value={totalPages ?? ""} onChange={(e) => setTotalPages(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full rounded-lg p-2 bg-black/5 dark:bg-white/10 outline-none text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm opacity-80">Current page (if applicable)</label>
          <input type="number" value={page ?? ""} onChange={(e) => setPage(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full rounded-lg p-2 bg-black/5 dark:bg-white/10 outline-none text-sm" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm opacity-80">Notes / key takeaways</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-lg p-2 bg-black/5 dark:bg-white/10 outline-none text-sm" />
        </div>
      </div>
      <motion.button whileTap={{ scale: 0.98 }} onClick={add} className="mt-3 rounded-lg px-4 py-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-sky-400 text-white text-sm">
        Add Item
      </motion.button>
    </div>
  );
}
