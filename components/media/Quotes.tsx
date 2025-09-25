"use client";

import { useMemo, useState } from "react";
import type { MediaData, Quote } from "@/lib/types";
import { loadMediaData, saveMediaData } from "@/lib/storage";

export function Quotes() {
  const [data, setData] = useState<MediaData>(loadMediaData());
  const [q, setQ] = useState("");
  const [text, setText] = useState("");
  const [source, setSource] = useState<string>(data.items[0]?.id || "");

  function add() {
    const t = text.trim();
    if (!t || !source) return;
    const item = data.items.find((i) => i.id === source);
    if (!item) return;
    const quote: Quote = {
      id: Math.random().toString(36).slice(2),
      sourceId: item.id,
      sourceTitle: item.title,
      text: t,
      createdAt: new Date().toISOString(),
    };
    const next: MediaData = { ...data, quotes: [quote, ...data.quotes] };
    setData(next);
    saveMediaData(next);
    setText("");
  }

  const list = useMemo(() => {
    const ql = q.toLowerCase();
    return data.quotes.filter((x) => x.text.toLowerCase().includes(ql) || x.sourceTitle.toLowerCase().includes(ql));
  }, [data.quotes, q]);

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Quotes</h3>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search quotes or source" className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/10 outline-none text-sm" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select value={source} onChange={(e) => setSource(e.target.value)} className="rounded-lg p-2 bg-black/5 dark:bg-white/10 text-sm">
            <option value="">Select source</option>
            {data.items.map((i) => (
              <option key={i.id} value={i.id}>{i.title}</option>
            ))}
          </select>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste quote" className="rounded-lg p-2 bg-black/5 dark:bg-white/10 text-sm" />
          <button onClick={add} className="rounded-lg px-3 py-2 bg-violet-500/90 text-white text-sm">Add Quote</button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {list.map((q) => (
          <blockquote key={q.id} className="p-3 rounded-lg bg-black/5 dark:bg-white/10">
            <div className="text-sm">“{q.text}”</div>
            <div className="text-xs mt-1 opacity-70">— {q.sourceTitle}</div>
          </blockquote>
        ))}
        {list.length === 0 && <div className="text-sm opacity-70">No quotes yet.</div>}
      </div>
    </div>
  );
}
