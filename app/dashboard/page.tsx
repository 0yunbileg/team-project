"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function DashboardPage() {
  const { user, updateUser } = useCurrentUser();

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div>home</div>
    </ProtectedRoute>
  );
}
