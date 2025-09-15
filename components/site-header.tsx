"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, User, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import AuthButton from "@/components/auth-button"

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Shop", href: "/shop" },
    { name: "Products", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="relative z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                fill="currentColor"
                viewBox="0 0 147 70"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-8 w-8 text-white"
              >
                <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"></path>
                <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"></path>
              </svg>
              <span className="text-xl font-semibold text-white">ShaderStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
              <Search className="h-4 w-4" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeToggle />
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-black/95 border-white/10">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-white/80 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <Link href="/cart" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-white/80">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cart
                      </Button>
                    </Link>
                    <Link href="/account" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-white/80">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </Button>
                    </Link>
                    <div className="pt-2">
                      <AuthButton />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
