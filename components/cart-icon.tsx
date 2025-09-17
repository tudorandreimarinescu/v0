"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart/cart-context"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function CartIcon() {
  const [mounted, setMounted] = useState(false)
  const cartData = useCart() // Moved useCart hook to the top level

  useEffect(() => {
    setMounted(true)
  }, [])

  const { itemCount, isLoading } = cartData

  if (!cartData) {
    console.error("[v0] CartIcon error: Cart context is not available")
    // Fallback when cart context is not available
    return (
      <Link href="/cart">
        <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground relative">
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </Link>
    )
  }

  if (!mounted) {
    return (
      <Link href="/cart">
        <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground relative">
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </Link>
    )
  }

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground relative">
        <ShoppingCart className="h-4 w-4" />
        {!isLoading && itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
