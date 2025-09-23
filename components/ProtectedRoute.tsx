"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")

    if (!currentUser) {
      router.push("/auth") // if not logged in → redirect
    } else {
      setLoading(false) // allow rendering
    }
  }, [router])

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center text-white bg-black'>
        Loading...
      </div>
    )
  }

  return <>{children}</>
}
