import { getAllUsers } from "@/lib/auth/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await getAllUsers()

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 })
    }

    return NextResponse.json({ users: result.users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
