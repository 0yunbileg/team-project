"use client";

import { getUser, updateUser } from "@/lib/storage";
import { User } from "@/types/user";

function applyPetAction(email: string, action: (user: User) => void) {
  const user = getUser(email);
  if (!user) return;

  action(user);
  updateUser(user);
}

export function feedPet(email: string) {
  applyPetAction(email, user => {
    if (user.points < 10) return;
    user.points -= 10;
    user.pet.hunger = Math.min(user.pet.hunger + 20, 100);
  });
}

export function playWithPet(email: string) {
  applyPetAction(email, user => {
    if (user.points < 10) return;
    user.points -= 10;
    user.pet.happiness = Math.min(user.pet.happiness + 20, 100);
  });
}

export function restPet(email: string) {
  applyPetAction(email, user => {
    if (user.points < 10) return;
    user.points -= 10;
    user.pet.energy = Math.min(user.pet.energy + 20, 100);
  });
}
