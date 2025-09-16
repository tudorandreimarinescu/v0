"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import PasswordStrength from "@/components/password-strength"

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
    }
    getUser()
  }, [router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) {
        throw new Error("Current password is incorrect")
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push("/profile")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Password updated</CardTitle>
              <CardDescription className="text-white/60">Your password has been successfully changed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80 mb-4">You will be redirected to your profile shortly.</p>
              <Link href="/profile">
                <Button className="w-full bg-white text-black hover:bg-white/90">Back to profile</Button>
              </Link>
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
              <CardTitle className="text-2xl text-white">Change Password</CardTitle>
              <CardDescription className="text-white/60">Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password" className="text-white/80">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password" className="text-white/80">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                    <PasswordStrength password={newPassword} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password" className="text-white/80">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <Button type="submit" className="w-full bg-white text-black hover:bg-white/90" disabled={isLoading}>
                    {isLoading ? "Updating password..." : "Update password"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  <Link href="/profile" className="text-purple-400 underline underline-offset-4 hover:text-purple-300">
                    Back to profile
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
