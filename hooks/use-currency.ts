"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { currencies, formatPrice, type Currency } from "@/lib/currency"

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[1]) // Default to EUR
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    RON: 4.97,
    EUR: 1.0,
    HUF: 390.5,
    GBP: 0.85,
  })

  useEffect(() => {
    // Load currency from cookie on mount
    const savedCurrency = Cookies.get("preferred-currency")
    if (savedCurrency) {
      const currency = currencies.find((c) => c.code === savedCurrency)
      if (currency) {
        setSelectedCurrency(currency)
      }
    }

    // Listen for currency changes
    const handleCurrencyChange = (event: CustomEvent) => {
      const currency = currencies.find((c) => c.code === event.detail.currency)
      if (currency) {
        setSelectedCurrency(currency)
      }
    }

    window.addEventListener("currencyChanged", handleCurrencyChange as EventListener)

    return () => {
      window.removeEventListener("currencyChanged", handleCurrencyChange as EventListener)
    }
  }, [])

  const convertPrice = (basePrice: number, baseCurrency = "EUR"): number => {
    if (baseCurrency === selectedCurrency.code) {
      return basePrice
    }

    // Convert to EUR first if needed
    const priceInEUR = baseCurrency === "EUR" ? basePrice : basePrice / exchangeRates[baseCurrency]

    // Convert from EUR to target currency
    return priceInEUR * exchangeRates[selectedCurrency.code]
  }

  const formatCurrency = (amount: number, baseCurrency = "EUR", locale?: string): string => {
    const convertedAmount = convertPrice(amount, baseCurrency)
    return formatPrice(convertedAmount, selectedCurrency.code, locale)
  }

  return {
    selectedCurrency,
    exchangeRates,
    convertPrice,
    formatCurrency,
  }
}
