"use client";

import { useEffect, useState, useRef } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function FocusPage() {
  const { user, updateUser } = useCurrentUser();

  const [minutesInput, setMinutesInput] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [status, setStatus] = useState<"idle" | "focus" | "paused" | "done">("idle");
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
      setSecondsFocused(secondsFocused % 60); // reset counter
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
        return { img: "/images/pet-happy.png", msg: "I’m cheering for you! Stay focused ✨" };
      case "paused":
        return { img: "/images/pet-sad.png", msg: "Don’t give up! You can do this 💪" };
      case "done":
        return { img: "/images/pet-excited.png", msg: `You did it! +${Math.floor(secondsFocused/60)} XP 🎉` };
      default:
        return { img: "/images/pet-neutral.png", msg: "Ready when you are! 🐾" };
    }
  };

  const pet = petState();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
        {/* Timer or input */}
        {status === "idle" ? (
          <div className="mb-4">
            <input
              type="number"
              min={1}
              placeholder="Minutes"
              value={minutesInput}
              onChange={(e) => setMinutesInput(Number(e.target.value))}
              className="mb-3 p-2 rounded text-black w-full"
            />
            <button
              onClick={() => {
                setSecondsLeft(minutesInput * 60);
                setStatus("focus");
              }}
              className="mb-6 px-4 py-2 bg-blue-500 rounded-lg text-white"
            >
              Start
            </button>
          </div>
        ) : (
          <div className="w-48 h-48 rounded-full border-8 border-indigo-500 flex items-center justify-center text-4xl font-bold text-gray-800 mb-4">
            {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
            {String(secondsLeft % 60).padStart(2, "0")}
          </div>
        )}

        {/* Controls */}
        {status !== "idle" && (
          <div className="mt-4 space-x-4">
            <button
              onClick={() =>
                setStatus(status === "focus" ? "paused" : "focus")
              }
              className="px-4 py-2 text-white rounded-lg"
              style={{
                backgroundColor:
                  status === "focus" ? "yellow" : status === "paused" ? "green" : "blue",
              }}
            >
              {status === "focus" && "Pause"}
              {status === "paused" && "Resume"}
              {status === "done" && "Done"}
            </button>
            <button
              onClick={resetTimer}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Reset
            </button>
          </div>
        )}

        {/* Pet */}
        <div className="mt-10 flex flex-col items-center transition-all">
          <img src={pet.img} alt="Pet" className="w-24 h-24 animate-bounce" />
          <p className="mt-2 text-gray-600 italic">{pet.msg}</p>
        </div>

        {/* Points */}
        <p className="mt-4 text-lg font-bold">Your points: {user.points}</p>
      </div>
    </ProtectedRoute>
  );
}
