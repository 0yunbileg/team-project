"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { feedPet, playWithPet, restPet } from "@/hooks/usePetActions";
import { useState, useEffect } from "react";

export default function PetPage() {
  const { user, updateUser } = useCurrentUser();
  const [petUser, setPetUser] = useState(user); // local copy for re-render

  // Sync state when user changes
  useEffect(() => {
    setPetUser(user);
  }, [user]);

  if (!petUser) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  const handleFeedPet = () => {
    feedPet(petUser.email);
    const updated = JSON.parse(
      localStorage.getItem("pusers:data:v1") || "[]"
    ).find((u: any) => u.email === petUser.email);
    if (updated) {
      setPetUser(updated);
      updateUser(updated); // update global state
    }
  };

  const handlePlayPet = () => {
    playWithPet(petUser.email);
    const updated = JSON.parse(
      localStorage.getItem("pusers:data:v1") || "[]"
    ).find((u: any) => u.email === petUser.email);
    if (updated) {
      setPetUser(updated);
      updateUser(updated);
    }
  };

  const handleRestPet = () => {
    restPet(petUser.email);
    const updated = JSON.parse(
      localStorage.getItem("pusers:data:v1") || "[]"
    ).find((u: any) => u.email === petUser.email);
    if (updated) {
      setPetUser(updated);
      updateUser(updated);
    }
  };

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
            onClick={handleFeedPet}
            className="bg-green-500 px-4 py-2 rounded mr-2 mt-2"
          >
            Feed (-10 pts)
          </button>
          <button
            onClick={handlePlayPet}
            className="bg-yellow-500 px-4 py-2 rounded mr-2 mt-2"
          >
            Play (-10 pts)
          </button>
          <button
            onClick={handleRestPet}
            className="bg-blue-500 px-4 py-2 rounded mt-2"
          >
            Rest (-10 pts)
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
