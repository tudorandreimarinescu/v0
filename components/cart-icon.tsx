"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart/cart-context"
import { Badge } from "@/components/ui/badge"

export default function CartIcon() {
  const { itemCount, isLoading } = useCart()

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
