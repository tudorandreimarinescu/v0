"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserIcon } from "lucide-react"

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getInitialUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("[v0] Initial session check:", session?.user?.email || "No session")

        if (sessionError) {
          console.error("Session error:", sessionError)
        }

        if (session?.user) {
          setUser(session.user)
          setLoading(false)
          return
        }

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error && error.message !== "Auth session missing!") {
          console.error("Error getting user:", error)
        }

        console.log("[v0] Initial user check:", user?.email || "No user")
        setUser(user)
      } catch (error) {
        if (error instanceof Error && !error.message.includes("Auth session missing")) {
          console.error("Error in getInitialUser:", error)
        }
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state change:", event, session?.user?.email || "No user")

      switch (event) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          setUser(session?.user ?? null)
          setLoading(false)
          break
        case "SIGNED_OUT":
          setUser(null)
          setLoading(false)
          break
        case "INITIAL_SESSION":
          setUser(session?.user ?? null)
          setLoading(false)
          break
        default:
          try {
            const {
              data: { session: currentSession },
            } = await supabase.auth.getSession()
            setUser(currentSession?.user ?? null)
          } catch (error) {
            console.error("Error getting session in auth state change:", error)
            setUser(null)
          }
          setLoading(false)
          break
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  console.log("[v0] AuthButton render - loading:", loading, "user:", user?.email || "No user")

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        Loading...
      </Button>
    )
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => router.push("/auth/login")}>
          Sign In
        </Button>
        <Button onClick={() => router.push("/auth/sign-up")}>Sign Up</Button>
      </div>
    )
  }

  const userInitials =
    user.user_metadata?.first_name?.[0] + user.user_metadata?.last_name?.[0] || user.email?.[0]?.toUpperCase() || "U"

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={() => router.push("/profile")}
        className="text-white/80 hover:text-white flex items-center gap-2"
      >
        <UserIcon className="h-4 w-4" />
        <span className="hidden sm:inline">My Profile</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.email || ""} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata?.first_name} {user.user_metadata?.last_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/orders")}>Order History</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile/change-password")}>Change Password</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
