"use client";

import { useEffect, useState, useMemo } from "react";
import { loadTimeLogs } from "@/lib/storage";
import type { TimeLog } from "@/lib/types";
import { Save } from "lucide-react";

export function TimeLogView() {
  const [logs, setLogs] = useState<TimeLog[]>([]);

  useEffect(() => {
    setLogs(loadTimeLogs());
    const onStorage = () => setLogs(loadTimeLogs());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const totalSeconds = useMemo(() => logs.reduce((s, l) => s + l.actualSeconds, 0), [logs]);

  function fmtDuration(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

  function exportLogsCSV() {
    const headers = [
      "id",
      "taskId",
      "taskTitle",
      "estimateMinutes",
      "startedAt",
      "endedAt",
      "actualSeconds",
    ];
    const rows = logs.map((l) => [
      l.id,
      l.taskId ?? "",
      JSON.stringify(l.taskTitle),
      l.estimateMinutes ?? "",
      l.startedAt,
      l.endedAt,
      l.actualSeconds,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "time-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Time Log</h3>
        <div className="text-xs opacity-70">Total: {fmtDuration(totalSeconds)}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs opacity-70">
            <tr>
              <th className="text-left p-2">Task</th>
              <th className="text-left p-2">Estimate</th>
              <th className="text-left p-2">Actual</th>
              <th className="text-left p-2">Δ</th>
              <th className="text-left p-2">Started</th>
              <th className="text-left p-2">Ended</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td className="p-2 opacity-70" colSpan={6}>No logs yet. Link a task and run the Pomodoro to start tracking.</td>
              </tr>
            )}
            {logs.map((l) => {
              const actualM = Math.round(l.actualSeconds / 60);
              const est = l.estimateMinutes ?? 0;
              const delta = actualM - est;
              return (
                <tr key={l.id} className="border-t border-black/10 dark:border-white/10">
                  <td className="p-2">{l.taskTitle}</td>
                  <td className="p-2">{est ? `${est}m` : "—"}</td>
                  <td className="p-2">{fmtDuration(l.actualSeconds)}</td>
                  <td className={`p-2 ${delta > 0 ? "text-amber-600" : delta < 0 ? "text-emerald-600" : ""}`}>{delta === 0 ? "0m" : `${delta > 0 ? "+" : ""}${delta}m`}</td>
                  <td className="p-2">{new Date(l.startedAt).toLocaleString()}</td>
                  <td className="p-2">{new Date(l.endedAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex justify-end">
        <button onClick={exportLogsCSV} className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/10 text-sm inline-flex items-center gap-2" title="Export logs">
          <Save size={14} /> Export
        </button>
      </div>
    </div>
  );
}
