"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePetManager } from "@/hooks/usePetManager";
import { getCurrentUser } from "@/lib/storage";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  usePetManager(); // always called at top level

  useEffect(() => {
    const currentUser = getCurrentUser(); // ✅ use storage helper

    if (!currentUser) {
      router.push("/auth"); // redirect if not logged in
    } else {
      setLoading(false); // allow rendering
    }
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
