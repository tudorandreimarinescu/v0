"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, User, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import AuthButton from "@/components/auth-button"
import CartIcon from "@/components/cart-icon"
import { SkipNavigation } from "@/components/accessibility/skip-navigation"
import { FocusTrap } from "@/components/accessibility/focus-trap"

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      <SkipNavigation />
      <header className="relative z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md" role="banner">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2" aria-label="kynky.ro homepage">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm" aria-hidden="true">
                    K
                  </span>
                </div>
                <span className="text-xl font-semibold text-white">kynky.ro</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm px-2 py-1"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white focus:ring-2 focus:ring-purple-400"
                aria-label="Search products"
              >
                <Search className="h-4 w-4" />
              </Button>
              <CartIcon />
              <ThemeToggle />
              <AuthButton />
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <CartIcon />
              <ThemeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white focus:ring-2 focus:ring-purple-400"
                    aria-label="Open navigation menu"
                    aria-expanded={isOpen}
                    aria-controls="mobile-navigation"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-black/95 border-white/10"
                  aria-label="Mobile navigation menu"
                  id="mobile-navigation"
                >
                  <FocusTrap isActive={isOpen}>
                    <nav className="flex flex-col space-y-4 mt-8" role="navigation" aria-label="Mobile navigation">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-lg font-medium text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm px-2 py-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <div className="border-t border-white/10 pt-4 space-y-2">
                        <Link href="/cart" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-white/80 focus:ring-2 focus:ring-purple-400"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Cart
                          </Button>
                        </Link>
                        <Link href="/account" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-white/80 focus:ring-2 focus:ring-purple-400"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Account
                          </Button>
                        </Link>
                        <div className="pt-2">
                          <AuthButton />
                        </div>
                      </div>
                    </nav>
                  </FocusTrap>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
