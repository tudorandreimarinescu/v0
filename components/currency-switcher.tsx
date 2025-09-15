"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DollarSign } from "lucide-react"

const currencies = [
  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
]

export function CurrencySwitcher() {
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")

  useEffect(() => {
    // Load currency from cookie on mount
    const savedCurrency = Cookies.get("preferred-currency")
    if (savedCurrency && currencies.find((c) => c.code === savedCurrency)) {
      setSelectedCurrency(savedCurrency)
    }
  }, [])

  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencyCode)
    // Save to cookie with 1 year expiration
    Cookies.set("preferred-currency", currencyCode, { expires: 365 })

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent("currencyChanged", {
        detail: { currency: currencyCode },
      }),
    )
  }

  const currentCurrency = currencies.find((curr) => curr.code === selectedCurrency)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
          <DollarSign className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">{currentCurrency?.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/95 border-white/10">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className={`text-white/80 hover:text-white hover:bg-white/10 ${
              selectedCurrency === currency.code ? "bg-white/5" : ""
            }`}
          >
            <span className="mr-2">{currency.flag}</span>
            <span className="mr-2">{currency.symbol}</span>
            {currency.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
