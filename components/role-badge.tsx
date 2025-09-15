import { Badge } from "@/components/ui/badge"

interface RoleBadgeProps {
  role: string
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive"
      case "user":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "Admin"
      case "user":
        return "User"
      default:
        return role
    }
  }

  return <Badge variant={getRoleColor(role)}>{getRoleLabel(role)}</Badge>
}
