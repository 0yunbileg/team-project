"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { feedPet, playWithPet, restPet } from "@/hooks/usePetActions";
import { useEffect, useState } from "react";
import { usePetManager } from "@/hooks/usePetManager";
import { User } from "@/types/user";
import PetDisplay from "@/components/PetDisplay";

export default function PetPage() {
  const { user } = useCurrentUser();
  const [petUser, setPetUser] = useState<User | null>(user);

  useEffect(() => {
    setPetUser(user);
  }, [user]);

  usePetManager();

  const refreshUser = () => {
    if (!user) return;
    const updated = JSON.parse(
      localStorage.getItem("pusers:data:v1") || "[]"
    ).find((u: User) => u.email === user.email);
    if (updated) setPetUser(updated);
  };

  const handleFeed = () => {
    if (!petUser) return;
    feedPet(petUser.email);
    refreshUser();
  };

  const handlePlay = () => {
    if (!petUser) return;
    playWithPet(petUser.email);
    refreshUser();
  };

  const handleRest = () => {
    if (!petUser) return;
    restPet(petUser.email);
    refreshUser();
  };

  if (!petUser) {
    return (
      <ProtectedRoute>
        <p className="text-blaxk">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-black text-white min-h-screen p-8 flex flex-col gap-8 items-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-black drop-shadow-lg">
          Your Virtual Pet 🐾
        </h1>

        {/* Pet Stats Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-black mb-4">Pet Stats</h2>

          {/* Progress Bars */}
          <div className="space-y-4">
            <StatBar label="Hunger" value={petUser.pet.hunger} color="bg-green-400" />
            <StatBar label="Happiness" value={petUser.pet.happiness} color="bg-yellow-400" />
            <StatBar label="Energy" value={petUser.pet.energy} color="bg-blue-400" />
          </div>

          {/* Points */}
          <p className="text-black mt-6">
            ⭐ <span className="font-bold">{petUser.points}</span> points
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleFeed}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium shadow-md"
            >
              Feed (-10 pts)
            </button>
            <button
              onClick={handlePlay}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition font-medium shadow-md"
            >
              Play (-10 pts)
            </button>
            <button
              onClick={handleRest}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-medium shadow-md"
            >
              Rest (-10 pts)
            </button>
          </div>
        </div>

        {/* Pet Display (avatar, animation, etc) */}
        <PetDisplay pet={petUser.pet} />
      </div>
    </ProtectedRoute>
  );
}

// ✅ Small progress bar component
function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-black  font-medium">{label}</span>
        <span className="text-black">{value}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
