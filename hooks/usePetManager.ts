"use client";

import { useEffect } from "react";
import { getCurrentUser, getUser, updateUser } from "@/lib/storage";
import { User } from "@/types/user";

/**
 * Automatically decreases pet stats every minute.
 * Works with currentUser email in localStorage.
 */
export function usePetManager() {
  useEffect(() => {
    const interval = setInterval(() => {
      const email = getCurrentUser();
      if (!email) return;

      const user = getUser(email);
      if (!user) return;

      // Decrease pet stats safely
      const updatedUser: User = {
        ...user,
        pet: {
          ...user.pet,
          hunger: Math.max(0, user.pet.hunger - 1),
          energy: Math.max(0, user.pet.energy - 1),
          happiness: Math.max(0, user.pet.happiness - 1),
        },
      };

      updateUser(updatedUser);
    }, 60000); // every 1 minute

    return () => clearInterval(interval);
  }, []);
}
