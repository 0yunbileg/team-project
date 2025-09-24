"use client";

import { useEffect, useState, useRef } from "react";
import ProtectedRoute from "@/components/ProtectedRoute"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function FocusPage() {
    const { user, updateUser } = useCurrentUser()

    const [minutes, setMinutes] = useState(25);
    const [time, setTime] = useState(minutes * 60);
    const [status, setStatus] = useState<
        "idle" | "focus" | "paused" | "done"
    >("idle");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Handle countdown effect
    useEffect(() => {
        if (status === "focus") {
            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    setTime((prev) => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current!);
                            timerRef.current = null;
                            setStatus("done");
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } else {
            clearInterval(timerRef.current!);
            timerRef.current = null;
        }

        return () => clearInterval(timerRef.current!);
    }, [status]);


    if (!user) {
        return (
            <ProtectedRoute>
                <p className='text-white'>Loading user data...</p>
            </ProtectedRoute>
        )
    }

    // Reset timer
    const resetTimer = () => {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setStatus("idle");
        setTime(minutes * 60);
    };

    // Pet reactions
    const getPetState = () => {
        switch (status) {
            case "focus":
                return { img: "/images/pet-happy.png", msg: "I’m cheering for you! Stay focused ✨" };
            case "paused":
                return { img: "/images/pet-sad.png", msg: "Don’t give up! You can do this 💪" };
            case "done":
                return { img: "/images/pet-excited.png", msg: "You did it! Here’s some XP 🎉" };
            default:
                return { img: "/images/pet-neutral.png", msg: "Ready when you are! 🐾" };
        }
    };

    const pet = getPetState();

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
                <div>
                    <input
                        type="number"
                        placeholder="Minutes"
                        value={minutes}
                        onChange={(e) => setMinutes(Number(e.target.value))}
                        className="mb-3 p-2 rounded text-black w-full"
                        required
                    />
                    <button
                        onClick={() => { setTime(minutes * 60); resetTimer(); }}
                        className="mb-6 px-4 py-2 bg-blue-500 rounded-lg"
                    >
                        Set Timer
                    </button>
                </div>
                {/* Timer */}
                <div className="w-48 h-48 rounded-full border-8 border-indigo-500 flex items-center justify-center text-4xl font-bold text-gray-800">
                    {String(Math.floor(time / 60)).padStart(2, "0")}:
                    {String(time % 60).padStart(2, "0")}
                </div>

                {/* Controls */}
                <div className="mt-4 space-x-4">
                    <button
                        onClick={() => { if (status === "idle" || status === "paused") setStatus("focus"); else if (status === "focus") setStatus("paused"); }}
                        className="px-4 py-2 text-white rounded-lg"
                        style={{ backgroundColor: status === "focus" ? "yellow" : status === "paused" ? "green" : "blue" }}
                    >
                        {status === "idle" && "Start"}
                        {status === "focus" && "Pause"}
                        {status === "paused" && "Resume"}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Reset
                    </button>
                </div>

                {/* Pet Reactions */}
                <div className="mt-10 flex flex-col items-center transition-all">
                    <img src={pet.img} alt="Pet" className="w-24 h-24 animate-bounce" />
                    <p className="mt-2 text-gray-600 italic">{pet.msg}</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
