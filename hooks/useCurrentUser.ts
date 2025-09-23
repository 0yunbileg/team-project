"use client";

import { useEffect, useState } from "react";

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

export interface Pet {
  hunger: number;
  happiness: number;
  energy: number;
}

export interface User {
  username: string;
  password: string;
  points: number;
  tasks: Task[];
  pet: Pet;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const currentUsername = localStorage.getItem("currentUser");
    if (!currentUsername) return;

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u) => u.username === currentUsername);

    if (foundUser) {
      setUser(foundUser);
    }
  }, []);

  // Save updates back to localStorage
  const updateUser = (updatedUser: User) => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const newUsers = users.map((u) =>
      u.username === updatedUser.username ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(newUsers));
    setUser(updatedUser);
  };

  return { user, updateUser };
}
