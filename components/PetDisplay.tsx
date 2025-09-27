"use client";

import React from "react";
import { Pet } from "@/types/user"; // adjust path if needed
import Image from "next/image";

interface PetDisplayProps {
  pet: Pet;
}

export default function PetDisplay({ pet }: PetDisplayProps) {
  // Determine current mood
  const getMood = () => {
    if (pet.hunger > 80) return "hungry";
    if (pet.energy < 20) return "sleepy";
    if (pet.happiness < 30) return "sad";
    return "happy";
  };

  const mood = getMood();

  // Map moods to local GIFs
  const petImages: Record<string, string> = {
    happy: "/images/pet/happy.gif",
    hungry: "/images/pet/hungry.gif",
    sleepy: "/images/pet/sleepy.gif",
    sad: "/images/pet/sad.gif",
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">{pet.name}</h2>
      <Image
        src={petImages[mood]}
        alt={`Pet is ${mood}`}
        width={200}
        height={200}
      />
      <div className="mt-2 flex gap-4 text-sm">
        <div>Happiness: {pet.happiness}</div>
        <div>Hunger: {pet.hunger}</div>
        <div>Energy: {pet.energy}</div>
      </div>
    </div>
  );
}
