"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { RoleBadge } from "@/components/auth/role-badge"
import { promoteToAdminClient } from "@/lib/auth/admin-client"
import { Shield, Mail, Calendar } from "lucide-react"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      const supabase = createClient()

      try {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      await promoteToAdminClient(userId)
      // Refresh users list
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: "admin" } : user)))
    } catch (error) {
      console.error("Error promoting user:", error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Users...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          User Management
        </CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : "No name provided"}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RoleBadge userId={user.id} />
                {user.role !== "admin" && (
                  <Button variant="outline" size="sm" onClick={() => handlePromoteToAdmin(user.id)}>
                    Promote to Admin
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
