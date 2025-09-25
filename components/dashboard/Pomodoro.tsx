"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX, Bell } from "lucide-react";

export function Pomodoro({ defaultMinutes = 25 }: { defaultMinutes?: number }) {
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.2); // 0..1
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);

  // Restore persisted audio prefs
  useEffect(() => {
    try {
      const m = localStorage.getItem("pomodoro:muted");
      const v = localStorage.getItem("pomodoro:volume");
      if (m !== null) setMuted(m === "1");
      if (v !== null) setVolume(Math.max(0, Math.min(1, parseFloat(v))));
    } catch {}
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setRunning(false);
      // stop music and rewind
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // play completion chime
      if (chimeRef.current) {
        chimeRef.current.currentTime = 0;
        chimeRef.current.volume = 0.6;
        chimeRef.current.play().catch(() => {});
      }
    }
  }, [secondsLeft]);

  // Sync audio with running/muted state
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
    el.volume = volume;
    el.loop = true;
    if (running && secondsLeft > 0 && !muted) {
      el.play().catch(() => {
        // Autoplay might be blocked; ignore silently
      });
    } else {
      el.pause();
    }
  }, [running, muted, secondsLeft, volume]);

  // Persist audio prefs when they change
  useEffect(() => {
    try {
      localStorage.setItem("pomodoro:muted", muted ? "1" : "0");
      localStorage.setItem("pomodoro:volume", String(volume));
    } catch {}
  }, [muted, volume]);

  function toggle() {
    setRunning((r) => !r);
  }
  function reset() {
    setRunning(false);
    setSecondsLeft(defaultMinutes * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const s = Math.floor(secondsLeft % 60).toString().padStart(2, "0");
  const pct = 100 - Math.floor((secondsLeft / (defaultMinutes * 60)) * 100);

  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Pomodoro</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-lg px-2 py-1 bg-black/5 dark:bg-white/10 text-xs flex items-center gap-1"
            aria-label={muted ? "Unmute chill music" : "Mute chill music"}
            title={muted ? "Unmute chill music" : "Mute chill music"}
          >
            <span className="hidden sm:inline">{muted ? "Muted" : "Sound"}</span>
          </button>
          <span className="text-xs text-black/60 dark:text-white/60">{defaultMinutes}m</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
            <path
              d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
              fill="none"
              className="opacity-20"
              strokeWidth="2"
            />
            <motion.path
              d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="100 100"
              animate={{ strokeDashoffset: 100 - pct }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            <defs>
              <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="font-mono text-lg">{m}:{s}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={toggle} className="rounded-lg px-3 py-2 bg-violet-500/90 text-white text-sm flex items-center gap-2">
            <AnimatePresence initial={false} mode="wait">
              {running ? (
                <motion.span key="pause" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                  <Pause size={14} /> Pause
                </motion.span>
              ) : (
                <motion.span key="play" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                  <Play size={14} /> Start
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button onClick={reset} className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/10 text-sm flex items-center gap-2">
            <RotateCcw size={14} /> Reset
          </button>
          <div className="flex items-center gap-2 text-xs">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
      {/* Hidden audio element for chill background music */}
      <audio
        ref={audioRef}
        preload="auto"
        src="https://cdn.pixabay.com/download/audio/2021/09/28/audio_0c0a2ff2f7.mp3?filename=lofi-study-112191.mp3"
      />
      {/* Completion chime */}
      <audio
        ref={chimeRef}
        preload="auto"
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8f1f00b3f.mp3?filename=ping-82822.mp3"
      />
    </div>
  );
}
