"use client"

import { useState } from "react"

interface User {
  username: string
  password: string
  points: number
  tasks: { id: number; title: string; done: boolean }[]
  pet: {
    hunger: number
    happiness: number
    energy: number
  }
}

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    let users: User[] = JSON.parse(localStorage.getItem("users") || "[]")

    if (isRegister) {
      // check if username already exists
      if (users.find((u) => u.username === username)) {
        setError("User already exists!")
        return
      }
      // create new user
      const newUser: User = {
        username,
        password,
        points: 0,
        tasks: [],
        pet: { hunger: 100, happiness: 100, energy: 100 },
      }
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", username)
      window.location.href = "/dashboard"
    } else {
      // login
      const user = users.find(
        (u) => u.username === username && u.password === password
      )
      if (!user) {
        setError("Invalid username or password")
        return
      }
      localStorage.setItem("currentUser", username)
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-700 to-blue-800 text-white'>
      <h1 className='text-3xl font-bold mb-6'>
        {isRegister ? "Register" : "Login"}
      </h1>

      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className='mb-3 p-2 rounded text-black'
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='mb-3 p-2 rounded text-black'
      />
      {error && <p className='text-red-300 mb-2'>{error}</p>}

      <button
        onClick={handleSubmit}
        className='bg-white text-purple-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition'
      >
        {isRegister ? "Register" : "Login"}
      </button>

      <p className='mt-4 text-sm'>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => {
            setIsRegister(!isRegister)
            setError("")
          }}
          className='underline cursor-pointer'
        >
          {isRegister ? "Login here" : "Register here"}
        </span>
      </p>
    </div>
  )
}
