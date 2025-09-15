"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { isAdminClient } from "@/lib/auth/admin-client"
import { useRouter } from "next/navigation"

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AdminGuard({ children, fallback, redirectTo = "/auth/login" }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const adminStatus = await isAdminClient()
        setIsAdmin(adminStatus)

        if (!adminStatus && redirectTo) {
          router.push(redirectTo)
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
        if (redirectTo) {
          router.push(redirectTo)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-600 mt-2">You need admin privileges to access this page.</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
