import { Badge } from "@/components/ui/badge"

interface RoleBadgeProps {
  role: string
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "default"
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

  const getRoleClassName = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-400 text-black"
      case "user":
        return "bg-white/10 text-white border-white/20"
      default:
        return "bg-white/10 text-white border-white/20"
    }
  }

  return (
    <Badge variant={getRoleColor(role)} className={getRoleClassName(role)}>
      {getRoleLabel(role)}
    </Badge>
  )
}
