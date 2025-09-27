"use client";

import { useEffect, useState, useRef } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PetDisplay from "@/components/PetDisplay";

export default function FocusPage() {
  const { user, updateUser } = useCurrentUser();

  const [minutesInput, setMinutesInput] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [status, setStatus] = useState<"idle" | "focus" | "paused" | "done">(
    "idle"
  );
  const [secondsFocused, setSecondsFocused] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer
  useEffect(() => {
    if (status === "focus" && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setStatus("done");
            return 0;
          }
          return prev - 1;
        });
        setSecondsFocused((prev) => prev + 1);
      }, 1000);
    } else if (status !== "focus") {
      clearInterval(timerRef.current!);
      timerRef.current = null;
    }

    return () => clearInterval(timerRef.current!);
  }, [status]);

  // Update points every full minute
  useEffect(() => {
    if (!user) return;
    const fullMinutes = Math.floor(secondsFocused / 60);
    if (fullMinutes > 0) {
      updateUser({ ...user, points: user.points + fullMinutes });
      setSecondsFocused(secondsFocused % 60);
    }
  }, [secondsFocused, user, updateUser]);

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  const resetTimer = () => {
    clearInterval(timerRef.current!);
    timerRef.current = null;
    setStatus("idle");
    setSecondsLeft(minutesInput * 60);
    setSecondsFocused(0);
  };

  const petState = () => {
    switch (status) {
      case "focus":
        return {
          img: "/images/pet-happy.png",
          msg: "I’m cheering for you! Stay focused ✨",
        };
      case "paused":
        return {
          img: "/images/pet-sad.png",
          msg: "Don’t give up! You can do this 💪",
        };
      case "done":
        return {
          img: "/images/pet-excited.png",
          msg: `You did it! 🎉`,
        };
      default:
        return {
          img: "/images/pet-neutral.png",
          msg: "Ready when you are! 🐾",
        };
    }
  };

  const pet = petState();

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center p-6 bg-black min-h-screen text-white">s
        {/* Timer or input */}
        {status === "idle" ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <input
              type="number"
              min={1}
              placeholder="Minutes"
              value={minutesInput}
              onChange={(e) => setMinutesInput(Number(e.target.value))}
              className="mb-4 p-2 rounded-lg text-white w-24 text-center"
            />
            <button
              onClick={() => {
                setSecondsLeft(minutesInput * 60);
                setStatus("focus");
              }}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md font-medium hover:opacity-90 transition"
            >
              Start
            </button>
          </div>
        ) : (
          <div className="relative w-56 h-56 mb-6">
            {/* Gradient ring */}
            <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-indigo-400 border-r-purple-500 animate-spin-slow"></div>
            {/* Timer text */}
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold bg-black/40 rounded-full">
              {minutes}:{seconds}
            </div>
          </div>
        )}

        {/* Controls */}
        {status !== "idle" && (
          <div className="flex gap-4 mb-6">
            {status !== "done" && (
              <button
                onClick={() =>
                  setStatus(status === "focus" ? "paused" : "focus")
                }
                className={`px-6 py-2 rounded-lg font-medium shadow-md transition ${
                  status === "focus"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {status === "focus" ? "Pause" : "Resume"}
              </button>
            )}
            <button
              onClick={resetTimer}
              className="px-6 py-2 bg-red-500 rounded-lg font-medium shadow-md hover:bg-red-600 transition"
            >
              Reset
            </button>
          </div>
        )}

        {/* Pet */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
          <PetDisplay pet={user.pet} />
          <p className="mt-3 text-lg font-semibold">{pet.msg}</p>
        </div>

        {/* Points */}
        <p className="mt-6 text-xl font-bold">
          Your points:{" "}
          <span className="text-yellow-400 drop-shadow-lg">{user.points}</span>
        </p>
      </div>
    </ProtectedRoute>
  );
}
