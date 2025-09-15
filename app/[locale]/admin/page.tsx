import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/auth/admin"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const adminStatus = await isAdmin(user.id)
  if (!adminStatus) {
    redirect("/")
  }

  return <AdminDashboard />
}
