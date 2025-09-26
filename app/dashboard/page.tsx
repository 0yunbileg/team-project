"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, updateUser } = useCurrentUser();

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  redirect("/dashboard/profile");
}
