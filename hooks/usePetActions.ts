// hooks/usePetActions.ts
export function feedPet() {
  const stored = localStorage.getItem("currentUser");
  if (!stored) return;

  const user = JSON.parse(stored);

  if (user.points < 10) return; // Not enough points

  user.points -= 10;
  user.pet.hunger = Math.min(user.pet.hunger + 20, 100);

  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function playWithPet() {
  const stored = localStorage.getItem("currentUser");
  if (!stored) return;

  const user = JSON.parse(stored);

  if (user.points < 10) return;

  user.points -= 10;
  user.pet.happiness = Math.min(user.pet.happiness + 20, 100);

  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function restPet() {
  const stored = localStorage.getItem("currentUser");
  if (!stored) return;

  const user = JSON.parse(stored);

  if (user.points < 10) return;

  user.points -= 10;
  user.pet.energy = Math.min(user.pet.energy + 20, 100);

  localStorage.setItem("currentUser", JSON.stringify(user));
}
