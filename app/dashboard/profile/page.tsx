"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProfilePage() {
  const { user, updateUser, logoutUser } = useCurrentUser();

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white text-center mt-10 text-lg animate-pulse">
          Loading user data...
        </p>
      </ProtectedRoute>
    );
  }

  const addPoints = (n: number) => {
    updateUser({ ...user, points: user.points + n });
  };

  return (
    <ProtectedRoute>
      <div className="bg-white text-black w-full h-full min-h-screen p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              {user.firstName} {user.lastName}
            </span>{" "}
            🎉
          </h1>
          <button
            onClick={logoutUser}
            className="mt-4 md:mt-0 bg-red-500 px-5 py-2 rounded-xl font-medium hover:bg-red-600 transition shadow-lg"
          >
            Logout
          </button>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Points Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Points 🌟</h2>
            <p className="text-lg mb-6">
              You have{" "}
              <span className="font-bold text-3xl text-yellow-400">
                {user.points}
              </span>{" "}
              points.
            </p>
            <button
              onClick={() => addPoints(10)}
              className="bg-green-500 px-5 py-2 rounded-xl hover:bg-green-600 transition shadow-md font-medium"
            >
              +10 Points
            </button>
          </div>

          {/* User Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Info 🧑‍💻</h2>
            <p className="mb-3">
              <span className="font-semibold">Job Title:</span> {user.jobTitle}
            </p>
            {user.goals.length > 0 && (
              <p>
                <span className="font-semibold">Goals:</span>{" "}
                {user.goals.join(", ")}
              </p>
            )}
          </div>

          {/* Pet Stats */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Pet Stats 🐾</h2>

            {/* Hunger */}
            <div className="mb-4">
              <p className="mb-2">Hunger</p>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-400 h-3 rounded-full transition-all"
                  style={{ width: `${user.pet.hunger}%` }}
                ></div>
              </div>
            </div>

            {/* Happiness */}
            <div className="mb-4">
              <p className="mb-2">Happiness</p>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-400 h-3 rounded-full transition-all"
                  style={{ width: `${user.pet.happiness}%` }}
                ></div>
              </div>
            </div>

            {/* Energy */}
            <div>
              <p className="mb-2">Energy</p>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-400 h-3 rounded-full transition-all"
                  style={{ width: `${user.pet.energy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
