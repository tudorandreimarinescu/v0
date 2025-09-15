import { createClient } from "@/lib/supabase/client"

// Client-side admin check
export async function isAdminClient(): Promise<boolean> {
  const supabase = createClient()

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

export async function getUserRoleClient(): Promise<string> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return "guest"

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    return profile?.role || "user"
  } catch {
    return "guest"
  }
}
