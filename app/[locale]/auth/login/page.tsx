"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useI18nPreview } from "@/hooks/use-i18n-preview"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const router = useRouter()
  const { t } = useI18nPreview()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setMagicLinkSent(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("auth.checkEmail")}</CardTitle>
              <CardDescription>{t("auth.magicLinkSent")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("auth.checkEmailDescription")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("auth.login")}</CardTitle>
              <CardDescription>{t("auth.loginDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="password" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="password">{t("auth.password")}</TabsTrigger>
                  <TabsTrigger value="magic">{t("auth.magicLink")}</TabsTrigger>
                </TabsList>

                <TabsContent value="password">
                  <form onSubmit={handleEmailLogin}>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">{t("auth.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">{t("auth.password")}</Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-sm text-red-500">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("auth.loggingIn") : t("auth.login")}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="magic">
                  <form onSubmit={handleMagicLink}>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="magic-email">{t("auth.email")}</Label>
                        <Input
                          id="magic-email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-sm text-red-500">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("auth.sendingLink") : t("auth.sendMagicLink")}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center text-sm">
                {t("auth.noAccount")}{" "}
                <Link href="/auth/sign-up" className="underline underline-offset-4">
                  {t("auth.signUp")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
