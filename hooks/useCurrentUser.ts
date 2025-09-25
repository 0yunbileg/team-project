"use client";

import { useEffect, useState } from "react";

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

export interface Pet {
  name: string;
  hunger: number;
  happiness: number;
  energy: number;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  goals: string[];
  password: string;
  points: number;
  tasks: Task[];
  pet: Pet;
}

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

  return { user, updateUser };
}
