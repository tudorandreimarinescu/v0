"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, GlobeIcon } from "@/components/simple-icons"

const locales = ["en", "ro", "hu", "de"] as const
const localeNames = {
  en: "English",
  ro: "Română",
  hu: "Magyar",
  de: "Deutsch",
} as const
const localeFlags = {
  en: "🇬🇧",
  ro: "🇷🇴",
  hu: "🇭🇺",
  de: "🇩🇪",
} as const

export function LanguageSwitcherPreview() {
  const [currentLocale, setCurrentLocale] = useState<keyof typeof localeNames>("en")
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: keyof typeof localeNames) => {
    setCurrentLocale(newLocale)
    setIsOpen(false)
    // In a real app, this would change the language
    console.log(`Language changed to: ${newLocale}`)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-white/80 hover:text-white">
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">
            {localeFlags[currentLocale]} {localeNames[currentLocale]}
          </span>
          <span className="sm:hidden">{localeFlags[currentLocale]}</span>
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] bg-black/95 border-white/10">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`cursor-pointer text-white/80 hover:text-white hover:bg-white/10 ${currentLocale === loc ? "bg-white/5" : ""}`}
          >
            <span className="mr-2">{localeFlags[loc]}</span>
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
