"use client";

import { useEffect } from "react";
import { getCurrentUser, getUser, updateUser } from "@/lib/storage";

export function usePetManager() {
  useEffect(() => {
    const interval = setInterval(() => {
      const email = getCurrentUser();
      if (!email) return;

      const user = getUser(email);
      if (!user) return;

      // Decrease pet stats safely
      user.pet.hunger = Math.max(0, user.pet.hunger - 1);
      user.pet.energy = Math.max(0, user.pet.energy - 1);
      user.pet.happiness = Math.max(0, user.pet.happiness - 1);

      updateUser(user);
    }, 60000); // decrease every 1 minute

    return () => clearInterval(interval);
  }, []);
}
