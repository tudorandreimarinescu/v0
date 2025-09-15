"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { UserProfile } from "@/lib/auth/admin"

interface ProfileEditFormProps {
  profile: UserProfile
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    email: profile.email || "",
  })

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update profile in database
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (profileError) throw profileError

      // Update auth metadata if name changed
      if (formData.first_name !== profile.first_name || formData.last_name !== profile.last_name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
          },
        })

        if (authError) throw authError
      }

      // Update email if changed
      if (formData.email !== profile.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        })

        if (emailError) throw emailError

        toast({
          title: "Profile Updated",
          description: "Please check your new email address to confirm the change.",
        })
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully updated.",
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={isLoading}
          required
        />
        <p className="text-xs text-muted-foreground">
          Changing your email will require verification of the new address.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              first_name: profile.first_name || "",
              last_name: profile.last_name || "",
              email: profile.email || "",
            })
          }}
          disabled={isLoading}
        >
          Reset
        </Button>
      </div>
    </form>
  )
}
