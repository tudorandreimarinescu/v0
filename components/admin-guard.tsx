"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        // Check user's role in profiles table
        const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (error || !profile) {
          console.error("Error fetching user profile:", error)
          setIsAdmin(false)
        } else {
          setIsAdmin(profile.role === "admin")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAdminStatus()
      } else {
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        router.push("/auth/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page. Admin access is required.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
