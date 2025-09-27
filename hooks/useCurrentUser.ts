"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getCurrentUser, getUser, updateUser as updateUserStorage } from "@/lib/storage";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ✅ add loading state

  useEffect(() => {
    const email = getCurrentUser();
    if (!email) {
      setLoading(false); // no current user
      return;
    }

    const u = getUser(email);
    if (u) setUser(u);

    setLoading(false);
  }, []);

  const updateUser = (updatedUser: User) => {
    updateUserStorage(updatedUser);
    setUser(updatedUser);
  };

  const logoutUser = () => {
    localStorage.removeItem("pcurrent:user");
    setUser(null);
  };

  return { user, loading, updateUser, logoutUser };
}
