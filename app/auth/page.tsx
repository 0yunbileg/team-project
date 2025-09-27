"use client";

import { useState } from "react";
import { HeroCard } from "@/components/HeroCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { setCurrentUser } from "@/lib/storage";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  goals: string[];
  password: string;
  points: number;
  tasks: { id: number; title: string; done: boolean }[];
  pet: { name: string; hunger: number; happiness: number; energy: number };
}

const JOB_OPTIONS = ["Student", "Worker", "Freelancer", "Other"];
const GOAL_OPTIONS = [
  "Focus more",
  "Phone addiction",
  "Time management",
  "Other",
];

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [customJob, setCustomJob] = useState("");

  const [goals, setGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState("");

  const [petName, setPetName] = useState("Fluffy");

  const [error, setError] = useState("");

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };
  
  const handleSubmit = () => {
    const users: User[] = JSON.parse(localStorage.getItem("pusers:data:v1") || "[]");
  
    if (isRegister) {
      if (users.find((u) => u.email === email)) {
        setError("User already exists!");
        return;
      }
  
      const finalJobTitle = jobTitle === "Other" ? customJob : jobTitle;
      const finalGoals = goals.includes("Other")
        ? [...goals.filter((g) => g !== "Other"), customGoal]
        : goals;
  
      const newUser: User = {
        firstName,
        lastName,
        email,
        jobTitle: finalJobTitle,
        goals: finalGoals,
        password,
        points: 10,
        tasks: [],
        pet: { name: petName, hunger: 100, happiness: 100, energy: 100 },
      };
  
      users.push(newUser);
      localStorage.setItem("pusers:data:v1", JSON.stringify(users));
      setCurrentUser(email); // ✅ use helper
      window.location.href = "/dashboard";
    } else {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        setError("Invalid email or password");
        return;
      }
      setCurrentUser(email); // ✅ use helper
      window.location.href = "/dashboard";
    }
  };
  

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground flex justify-center items-center">
      <HeroCard
        title={isRegister ? "Create your account" : "Welcome back"}
        subtitle={
          isRegister
            ? "A few details to personalize your experience"
            : "Login to continue your progress"
        }
        rightSlot={<ThemeToggle />}
      >
        <div className="max-w-xl">
          {isRegister && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs opacity-70">First name</label>
                <input
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs opacity-70">Last name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div className="mt-3 grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs opacity-70">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs opacity-70">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
                required
              />
            </div>
          </div>

          {isRegister && (
            <div className="mt-3 grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs opacity-70">Pet name</label>
                <input
                  type="text"
                  placeholder="Fluffy"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs opacity-70">Job title</label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
                  required
                >
                  <option value="">Select Job Title</option>
                  {JOB_OPTIONS.map((job) => (
                    <option key={job} value={job}>
                      {job}
                    </option>
                  ))}
                </select>
              </div>
              {jobTitle === "Other" && (
                <div>
                  <label className="text-xs opacity-70">Custom job title</label>
                  <input
                    type="text"
                    placeholder="Enter your job title"
                    value={customJob}
                    onChange={(e) => setCustomJob(e.target.value)}
                    className="mt-1 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <div className="text-xs opacity-70 mb-1">Goals</div>
                <div className="flex flex-wrap gap-2">
                  {GOAL_OPTIONS.map((goal) => {
                    const active = goals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={
                          "px-3 py-1.5 rounded-full text-sm transition " +
                          (active
                            ? "bg-violet-500/90 text-white"
                            : "bg-black/5 dark:bg-white/10")
                        }
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
                {goals.includes("Other") && (
                  <input
                    type="text"
                    placeholder="Enter your goal"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="mt-2 w-full rounded-md px-3 py-2 bg-black/5 dark:bg-white/10 outline-none"
                    required
                  />
                )}
              </div>
            </div>
          )}

          {error && <div className="mt-3 text-sm text-red-500">{error}</div>}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md bg-violet-500/90 text-white hover:opacity-90 transition"
            >
              {isRegister ? "Create account" : "Login"}
            </button>
            <div className="text-sm">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="underline"
              >
                {isRegister ? "Login here" : "Register here"}
              </button>
            </div>
          </div>
        </div>
      </HeroCard>
    </div>
  );
}
