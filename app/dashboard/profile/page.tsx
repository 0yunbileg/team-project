"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function ProfilePage() {
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

    console.log("Rendering ProfilePage with user:", user)
    return (
        <ProtectedRoute>
            <div className='bg-gradient-to-r from-blue-900 to-purple-800 p-8 text-white min-h-screen'>
                <div className='p-8 text-white '>
                    <h1 className='text-2xl font-bold mb-4'>
                        Welcome, {user.email} 🎉
                    </h1>
                    <p className='mb-4'>You have {user.points} points.</p>

                    <button
                        onClick={addPoints}
                        className='bg-green-500 px-4 py-2 rounded hover:bg-green-600'
                    >
                        +10 Points
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem("currentUser")
                            window.location.href = "/"
                        }}
                        className='mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                    >
                        Logout
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    )
}
