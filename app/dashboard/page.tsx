"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function DashboardPage() {
  const { user, updateUser } = useCurrentUser()

  if (!user) {
    return (
      <ProtectedRoute>
        <p className='text-white'>Loading user data...</p>
      </ProtectedRoute>
    )
  }

  const addPoints = () => {
    updateUser({ ...user, points: user.points + 10 })
  }
  return (
    <ProtectedRoute>
      <div className='p-8 text-white bg-gradient-to-r from-blue-900 to-purple-800 h-screen'>
        <h1 className='text-2xl font-bold'>Welcome to Dashboard 🎉</h1>
        <p>You’re logged in!</p>
        <button
          onClick={() => {
            localStorage.removeItem("currentUser")
            window.location.href = "/"
          }}
          className='mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
        >
          Logout
        </button>
        <div className='p-8 text-white bg-gradient-to-r from-blue-900 to-purple-800 h-screen'>
          <h1 className='text-2xl font-bold mb-4'>
            Welcome, {user.username} 🎉
          </h1>
          <p className='mb-4'>You have {user.points} points.</p>

          <button
            onClick={addPoints}
            className='bg-green-500 px-4 py-2 rounded hover:bg-green-600'
          >
            +10 Points
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
