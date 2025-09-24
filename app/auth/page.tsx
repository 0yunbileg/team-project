"use client";

import { useState } from "react";

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
const GOAL_OPTIONS = ["Focus more", "Phone addiction", "Time management", "Other"];

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
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

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
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", email);
      window.location.href = "/dashboard";
    } else {
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) {
        setError("Invalid email or password");
        return;
      }
      localStorage.setItem("currentUser", email);
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-700 to-blue-800 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{isRegister ? "Register" : "Login"}</h1>

      {isRegister && (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mb-3 p-2 rounded text-black w-full"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mb-3 p-2 rounded text-black w-full"
            required
          />
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 p-2 rounded text-black w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-3 p-2 rounded text-black w-full"
        required
      />

      {isRegister && (
        <>
          <input
            type="string"
            placeholder="Pet Name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="mb-3 p-2 rounded text-black w-full"
            required
          />
          <select
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="mb-3 p-2 rounded text-black w-full"
            required
          >
            <option value="">Select Job Title</option>
            {JOB_OPTIONS.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
          {jobTitle === "Other" && (
            <input
              type="text"
              placeholder="Enter your job title"
              value={customJob}
              onChange={(e) => setCustomJob(e.target.value)}
              className="mb-3 p-2 rounded text-black w-full"
              required
            />
          )}

          <div className="mb-3">
            <p className="mb-1">Goals:</p>
            {GOAL_OPTIONS.map((goal) => (
              <label key={goal} className="block">
                <input
                  type="checkbox"
                  checked={goals.includes(goal)}
                  onChange={() => toggleGoal(goal)}
                  className="mr-2"
                />
                {goal}
              </label>
            ))}
            {goals.includes("Other") && (
              <input
                type="text"
                placeholder="Enter your goal"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                className="mt-2 p-2 rounded text-black w-full"
                required
              />
            )}
          </div>
        </>
      )}

      {error && <p className="text-red-300 mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="bg-white text-purple-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition w-full"
      >
        {isRegister ? "Register" : "Login"}
      </button>

      <p className="mt-4 text-sm">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          className="underline cursor-pointer"
        >
          {isRegister ? "Login here" : "Register here"}
        </span>
      </p>
    </div>
  );
}
