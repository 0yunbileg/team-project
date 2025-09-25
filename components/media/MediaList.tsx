"use client";

import { useMemo, useState } from "react";
import type { MediaData, MediaItem, MediaStatus, MediaType } from "@/lib/types";
import { loadMediaData, saveMediaData } from "@/lib/storage";
import { motion } from "framer-motion";

const statuses: MediaStatus[] = ["to_start", "in_progress", "finished"];
const types: MediaType[] = ["book", "article", "podcast", "course", "documentary"];

export function MediaList() {
  const [data, setData] = useState<MediaData>(loadMediaData());
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState<MediaStatus | "all">("all");
  const [filterType, setFilterType] = useState<MediaType | "all">("all");

  function update(item: MediaItem) {
    const next: MediaData = { ...data, items: data.items.map((i) => (i.id === item.id ? { ...item, updatedAt: new Date().toISOString() } : i)) };
    setData(next);
    saveMediaData(next);
  }

  const list = useMemo(() => {
    return data.items
      .filter((i) => (filterStatus === "all" ? true : i.status === filterStatus))
      .filter((i) => (filterType === "all" ? true : i.type === filterType))
      .filter((i) => {
        const s = (i.title + " " + (i.authorOrSource || "")).toLowerCase();
        return s.includes(q.toLowerCase());
      });
  }, [data.items, q, filterStatus, filterType]);

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Library</h3>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title/source" className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/10 outline-none text-sm" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="rounded-lg p-2 bg-black/5 dark:bg-white/10 text-sm">
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="rounded-lg p-2 bg-black/5 dark:bg-white/10 text-sm">
            <option value="all">All status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {list.map((i, idx) => (
          <motion.div key={i.id} className="p-3 rounded-lg bg-black/5 dark:bg-white/10" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-14 rounded bg-black/10 dark:bg-white/10 grid place-items-center text-xs capitalize">{i.type.slice(0,1)}</div>
              <div className="min-w-0">
                <div className="font-medium truncate">{i.title}</div>
                <div className="text-xs opacity-70 truncate">{i.authorOrSource || "Unknown"}</div>
                <div className="text-xs mt-1">
                  <span className="opacity-70">Status:</span> <span className="capitalize">{i.status.replaceAll("_"," ")}</span>
                  {i.totalPages ? (
                    <>
                      <span className="opacity-70"> · Page:</span> {i.page ?? 0}/{i.totalPages}
                    </>
                  ) : null}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs">
                {i.status !== "finished" && i.totalPages ? (
                  <button
                    className="rounded px-2 py-1 bg-violet-500/90 text-white"
                    onClick={() => update({ ...i, page: Math.min((i.page ?? 0) + 10, i.totalPages!) })}
                  >+10 pages</button>
                ) : null}
                {i.status !== "finished" ? (
                  <button className="rounded px-2 py-1 bg-black/5 dark:bg-white/10" onClick={() => update({ ...i, status: "in_progress" })}>Start</button>
                ) : null}
                {i.status !== "finished" ? (
                  <button className="rounded px-2 py-1 bg-emerald-500/90 text-white" onClick={() => update({ ...i, status: "finished" })}>Finish</button>
                ) : null}
              </div>
            </div>
            {i.notes ? <div className="text-xs mt-2 opacity-80">Notes: {i.notes}</div> : null}
          </motion.div>
        ))}
        {list.length === 0 && <div className="text-sm opacity-70">No matching items. Try clearing filters.</div>}
      </div>
    </div>
  );
}
