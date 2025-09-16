import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; redirect?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code)
    if (error) {
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  }

  if (params.error) {
    redirect(`/auth/error?error=${encodeURIComponent(params.error)}`)
  }

  const redirectTo = params.redirect || "/"
  redirect(redirectTo)
}
