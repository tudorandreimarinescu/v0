"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getUserRole } from "@/lib/auth/admin"

interface RoleBadgeProps {
  userId?: string
  className?: string
}

export function RoleBadge({ userId, className }: RoleBadgeProps) {
  const [role, setRole] = useState<string>("loading")

  useEffect(() => {
    async function fetchRole() {
      try {
        const userRole = await getUserRole(userId)
        setRole(userRole)
      } catch (error) {
        console.error("Error fetching user role:", error)
        setRole("error")
      }
    }

    fetchRole()
  }, [userId])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "user":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "guest":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (role === "loading") {
    return <Badge className={className}>Loading...</Badge>
  }

  if (role === "error") {
    return (
      <Badge variant="destructive" className={className}>
        Error
      </Badge>
    )
  }

  return <Badge className={`${getRoleColor(role)} ${className}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
}
