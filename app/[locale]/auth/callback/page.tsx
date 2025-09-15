import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  if (params.error) {
    redirect(`/auth/error?error=${params.error}`)
  }

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code)
    if (error) {
      redirect(`/auth/error?error=${error.message}`)
    }
  }

  // Successful authentication, redirect to home
  redirect("/")
}
