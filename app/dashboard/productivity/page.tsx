"use client";

import { Tasks } from "@/components/dashboard/Tasks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProductivityPage() {
  const { user } = useCurrentUser();

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold gradient-text">
            Productivity Dashboard
          </h1>
          <div className="text-lg font-medium">Points: {user.points}</div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Tasks />
        </div>
      </div>
    </ProtectedRoute>
  );
}
