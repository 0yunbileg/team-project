"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProfilePage() {
  const { user, updateUser, logoutUser } = useCurrentUser();

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  const addPoints = (n: number) => {
    updateUser({ ...user, points: user.points + n });
  };

  console.log("Rendering ProfilePage with user:", user);
  return (
    <ProtectedRoute>
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 min-h-screen p-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold">
            Welcome, {user.firstName} {user.lastName} 🎉
          </h1>
          <button
            onClick={logoutUser}
            className="mt-4 md:mt-0 bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Points Section */}
        <div className="bg-white text-black bg-opacity-10 rounded p-6 max-w-md">
          <p className="mb-4 text-lg">
            You have <span className="font-bold">{user.points}</span> points.
          </p>
          <button
            onClick={() => addPoints(10)}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
          >
            +10 Points
          </button>
        </div>

        {/* User Info */}
        <div className="max-w-md">
          <h2 className="text-xl font-semibold mb-2">Your Info:</h2>
          <p>Job Title: {user.jobTitle}</p>
          {user.goals.length > 0 && <p>Goals: {user.goals.join(", ")}</p>}
        </div>

        {/* Pet Stats */}
        <div className="text-black max-w-md mt-4 bg-white bg-opacity-10 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Pet Stats 🐾</h2>
          <p>Hunger: {user.pet.hunger}%</p>
          <p>Happiness: {user.pet.happiness}%</p>
          <p>Energy: {user.pet.energy}%</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
