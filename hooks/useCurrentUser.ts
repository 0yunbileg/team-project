"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const currentEmail = localStorage.getItem("currentUser");
    if (!currentEmail) return;

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u) => u.email === currentEmail);

    if (foundUser) {
      setUser(foundUser);
    } else {
      // Invalid session cleanup
      localStorage.removeItem("currentUser");
      setUser(null);
    }
  }, []);

  // Save updates back to localStorage
  const updateUser = (updatedUser: User) => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const newUsers = users.map((u) =>
      u.email === updatedUser.email ? updatedUser : u
    );

    localStorage.setItem("users", JSON.stringify(newUsers));
    setUser(updatedUser);
  };

  // Logout user (clear session)
  const logoutUser = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.href = "/"; // optional redirect
  };

  return { user, updateUser, logoutUser };
}
