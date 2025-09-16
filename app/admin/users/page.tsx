"use client"

import AdminGuard from "@/components/admin-guard"
import RoleBadge from "@/components/role-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, UserPlus, UserMinus, Search, Users, Building2 } from "lucide-react"
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
      } else {
        toast({
          title: "Eroare",
          description: data.error || "Nu s-au putut încărca utilizatorii",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca utilizatorii",
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
          title: "Succes",
          description: "Utilizatorul a fost promovat la administrator",
        })
        fetchUsers() // Refresh the list
      } else {
        toast({
          title: "Eroare",
          description: data.error || "Nu s-a putut promova utilizatorul",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut promova utilizatorul",
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
          title: "Succes",
          description: "Utilizatorul a fost retrogradat la utilizator obișnuit",
        })
        fetchUsers() // Refresh the list
      } else {
        toast({
          title: "Eroare",
          description: data.error || "Nu s-a putut retrograda utilizatorul",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut retrograda utilizatorul",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const adminCount = users.filter((user) => user.role === "admin").length
  const userCount = users.filter((user) => user.role === "user").length

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi la Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Gestionare Utilizatori</h1>
            <p className="text-muted-foreground">Administrează conturile și permisiunile utilizatorilor</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Utilizatori înregistrați în sistem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administratori</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminCount}</div>
                <p className="text-xs text-muted-foreground">Utilizatori cu privilegii administrative</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilizatori Obișnuiți</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
                <p className="text-xs text-muted-foreground">Utilizatori cu acces standard</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Toți Utilizatorii ({filteredUsers.length})</CardTitle>
              <CardDescription>Vezi și administrează rolurile și permisiunile utilizatorilor</CardDescription>
              <div className="flex items-center space-x-2 pt-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Caută utilizatori după nume sau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Se încarcă utilizatorii...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm ? "Niciun utilizator găsit" : "Niciun utilizator înregistrat"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Încearcă să modifici termenul de căutare."
                      : "Nu există utilizatori în sistem momentan."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilizator</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Data Înregistrării</TableHead>
                      <TableHead>Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
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
                                  {user.first_name && user.last_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : user.email}
                                </p>
                                {user.first_name && user.last_name && (
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <RoleBadge role={user.role} />
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString("ro-RO", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </TableCell>
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
                                  Promovează
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => demoteUser(user.id)}
                                  disabled={actionLoading === user.id}
                                >
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Retrogradează
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
