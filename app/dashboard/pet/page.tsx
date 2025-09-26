"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrentUser, User } from "@/hooks/useCurrentUser";

export default function PetPage() {
  const { user, updateUser } = useCurrentUser();

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-white">Loading user data...</p>
      </ProtectedRoute>
    );
  }

  const feedPet = () => {
    console.log("Feeding pet...");
    if (user.points < 10) return; // not enough points

    console.log("Feeding pet...1");
    const updatedUser: User = {
      ...user,
      points: user.points - 10,
      pet: {
        ...user.pet,
        hunger: Math.min(user.pet.hunger + 20, 100), // increase hunger, cap at 100
      },
    };

    updateUser(updatedUser);

    console.log("Feeding pet, updated user:", updatedUser);
  };

  const playWithPet = () => {
    if (user.points < 10) return;

    const updatedUser: User = {
      ...user,
      points: user.points - 10,
      pet: {
        ...user.pet,
        happiness: Math.min(user.pet.happiness + 20, 100),
      },
    };

    updateUser(updatedUser);
  };

  const restPet = () => {
    if (user.points < 10) return;

    const updatedUser: User = {
      ...user,
      points: user.points - 10,
      pet: {
        ...user.pet,
        energy: Math.min(user.pet.energy + 20, 100),
      },
    };

    updateUser(updatedUser);
  };

  return (
    <ProtectedRoute>
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 min-h-screen p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-white">Pet Stats 🐾</h1>

        <div className=" bg-white bg-opacity-10 p-4 rounded max-w-md">
          <p>Hunger: {user.pet.hunger}%</p>
          <p>Happiness: {user.pet.happiness}%</p>
          <p>Energy: {user.pet.energy}%</p>
          <p>Points: {user.points}</p>

          <button
            onClick={feedPet}
            className="bg-green-500 px-4 py-2 rounded mr-2 mt-2"
          >
            Feed (-10 pts)
          </button>
          <button
            onClick={playWithPet}
            className="bg-yellow-500 px-4 py-2 rounded mr-2 mt-2"
          >
            Play (-10 pts)
          </button>
          <button
            onClick={restPet}
            className="bg-blue-500 px-4 py-2 rounded mt-2"
          >
            Rest (-10 pts)
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
