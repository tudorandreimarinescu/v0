"use client"

import { useCartStore } from "@/lib/cart/store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Minus, Plus, Trash2, X } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/supabase/products"

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCartStore()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative border-white/20 text-white bg-transparent hover:bg-white/10"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg bg-black/95 border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-between">
            Shopping Cart ({totalItems})
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 mb-4">Your cart is empty</p>
                <Button onClick={() => setIsOpen(false)} className="bg-white text-black hover:bg-white/90">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                      {item.variantName && <p className="text-white/60 text-xs">{item.variantName}</p>}
                      <p className="text-white/80 text-sm">{formatPrice(item.price, item.currency)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0 border-white/20 text-white bg-transparent hover:bg-white/10"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0 border-white/20 text-white bg-transparent hover:bg-white/10"
                        disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-white/10 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Total:</span>
                  <span className="text-white font-semibold text-lg">
                    {formatPrice(totalPrice, items[0]?.currency || "USD")}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white bg-transparent hover:bg-white/10"
                    >
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-white text-black hover:bg-white/90">Checkout</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
