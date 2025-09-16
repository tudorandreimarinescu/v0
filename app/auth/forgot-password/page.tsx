"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Check your email</CardTitle>
              <CardDescription className="text-white/60">Password reset instructions sent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-200 mb-4">
                We've sent password reset instructions to <strong className="text-white">{email}</strong>. Click the
                link in your email to reset your password.
              </p>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-purple-400 underline underline-offset-4 hover:text-purple-300"
                >
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Reset your password</CardTitle>
              <CardDescription className="text-white/60">
                Enter your email to receive reset instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <Button type="submit" className="w-full bg-white text-black hover:bg-white/90" disabled={isLoading}>
                    {isLoading ? "Sending instructions..." : "Send reset instructions"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  <span className="text-white/60">Remember your password? </span>
                  <Link
                    href="/auth/login"
                    className="text-purple-400 underline underline-offset-4 hover:text-purple-300"
                  >
                    Back to login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
