"use client"

import AdminGuard from "@/components/admin-guard"
import RoleBadge from "@/components/role-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  avatar_url: string | null
  created_at: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const promoteUser = async (userId: string) => {
    setActionLoading(userId)
    try {
      const response = await fetch("/api/admin/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "User promoted to admin",
        })
        fetchUsers() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to promote user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const demoteUser = async (userId: string) => {
    setActionLoading(userId)
    try {
      const response = await fetch("/api/admin/demote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "User demoted to regular user",
        })
        fetchUsers() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to demote user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to demote user",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const userInitials =
                        (user.first_name?.[0] || "") + (user.last_name?.[0] || "") ||
                        user.email[0]?.toUpperCase() ||
                        "U"

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.email} />
                                <AvatarFallback>{userInitials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {user.first_name} {user.last_name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <RoleBadge role={user.role} />
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.role === "user" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => promoteUser(user.id)}
                                  disabled={actionLoading === user.id}
                                >
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Promote
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => demoteUser(user.id)}
                                  disabled={actionLoading === user.id}
                                >
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Demote
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
