"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.push("/dashboard") // skip landing if logged in
    } else {
      setChecking(false)
    }
  }, [router])

  if (checking) {
    return (
      <div className='bg-gradient-to-r from-blue-900 to-purple-800 min-h-screen flex items-center justify-center bg-black text-white'>
        Loading...
      </div>
    )
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-800 to-blue-900 text-white'>
      <h1 className='text-4xl font-bold mb-4'>Study Buddy 🐾</h1>
      <p className='text-lg max-w-md text-center mb-8'>
        Track your study time, build good habits, and take care of your own
        virtual pet while staying productive!
      </p>
      <button
        onClick={() => router.push("/auth")}
        className='bg-white text-purple-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition'
      >
        Get Started
      </button>
    </div>
  )
}
