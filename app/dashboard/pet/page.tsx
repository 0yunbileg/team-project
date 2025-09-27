"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { feedPet, playWithPet, restPet } from "@/hooks/usePetActions";
import { useEffect, useState } from "react";
import { usePetManager } from "@/hooks/usePetManager";
import { User } from "@/types/user";

export default function PetPage() {
  const { user, updateUser } = useCurrentUser();
  const [petUser, setPetUser] = useState<User | null>(user);

  // Sync local state whenever current user updates
  useEffect(() => {
    setPetUser(user);
  }, [user]);

  // Auto-decrease pet stats and update state
  usePetManager();

  // Helper to refresh petUser from storage after action
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
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 min-h-screen p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-white">Pet Stats 🐾</h1>

        <div className="bg-white bg-opacity-10 p-4 rounded max-w-md">
          <p>Hunger: {petUser.pet.hunger}%</p>
          <p>Happiness: {petUser.pet.happiness}%</p>
          <p>Energy: {petUser.pet.energy}%</p>
          <p>Points: {petUser.points}</p>

          <button
            onClick={handleFeed}
            className="bg-green-500 px-4 py-2 rounded mr-2 mt-2"
          >
            Feed (-10 pts)
          </button>
          <button
            onClick={handlePlay}
            className="bg-yellow-500 px-4 py-2 rounded mr-2 mt-2"
          >
            Play (-10 pts)
          </button>
          <button
            onClick={handleRest}
            className="bg-blue-500 px-4 py-2 rounded mt-2"
          >
            Rest (-10 pts)
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
