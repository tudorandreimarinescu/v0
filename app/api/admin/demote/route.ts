import { demoteFromAdmin } from "@/lib/auth/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const result = await demoteFromAdmin(userId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error demoting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
