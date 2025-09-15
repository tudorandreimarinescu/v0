import { createClient } from "@/lib/supabase/server"

export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    // Check the user's role in the profiles table
    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (error || !profile) return false

    return profile.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

/**
 * Get the current user's profile with role information
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error || !profile) return null

    return profile as UserProfile
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

/**
 * Promote a user to admin role (admin only)
 */
export async function promoteToAdmin(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Check if current user is admin
    const currentUserIsAdmin = await isAdmin()
    if (!currentUserIsAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" }
    }

    const { error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Demote an admin to regular user (admin only)
 */
export async function demoteFromAdmin(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Check if current user is admin
    const currentUserIsAdmin = await isAdmin()
    if (!currentUserIsAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" }
    }

    const { error } = await supabase.from("profiles").update({ role: "user" }).eq("id", userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<{ users: UserProfile[]; error?: string }> {
  try {
    const supabase = await createClient()

    // Check if current user is admin
    const currentUserIsAdmin = await isAdmin()
    if (!currentUserIsAdmin) {
      return { users: [], error: "Unauthorized: Admin access required" }
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return { users: [], error: error.message }
    }

    return { users: profiles as UserProfile[] }
  } catch (error) {
    return { users: [], error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Require admin access - throws error if not admin
 */
export async function requireAdmin(): Promise<UserProfile> {
  const profile = await getCurrentUserProfile()

  if (!profile) {
    throw new Error("Authentication required")
  }

  if (profile.role !== "admin") {
    throw new Error("Admin access required")
  }

  return profile
}
