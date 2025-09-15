import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

export async function isAdmin(userId?: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id

    if (!targetUserId) return false

    // Check role in profiles table
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", targetUserId).single()

    return profile?.role === "admin"
  } catch {
    return false
  }
}

export async function requireAdmin() {
  const adminStatus = await isAdmin()
  if (!adminStatus) {
    throw new Error("Admin access required")
  }
  return adminStatus
}

export async function getUserRole(userId?: string): Promise<string> {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id

    if (!targetUserId) return "guest"

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", targetUserId).single()

    return profile?.role || "user"
  } catch {
    return "guest"
  }
}

// Client-side admin check
export async function isAdminClient(): Promise<boolean> {
  const supabase = createBrowserClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    return profile?.role === "admin"
  } catch {
    return false
  }
}

export async function promoteToAdmin(targetUserId: string): Promise<void> {
  const supabase = await createClient()

  // Call the database function to promote user
  const { error } = await supabase.rpc("promote_to_admin", {
    target_user_id: targetUserId,
  })

  if (error) {
    throw new Error(`Failed to promote user: ${error.message}`)
  }
}
