"use client"

import { useCurrency } from "@/hooks/use-currency"
import { useLocale } from "next-intl"

interface PriceDisplayProps {
  price: number
  baseCurrency?: string
  className?: string
  showOriginal?: boolean
}

export function PriceDisplay({ price, baseCurrency = "EUR", className = "", showOriginal = false }: PriceDisplayProps) {
  const { formatCurrency, selectedCurrency, convertPrice } = useCurrency()
  const locale = useLocale()

  const formattedPrice = formatCurrency(price, baseCurrency, locale)
  const convertedPrice = convertPrice(price, baseCurrency)

  return (
    <div className={className}>
      <span className="font-semibold">{formattedPrice}</span>
      {showOriginal && selectedCurrency.code !== baseCurrency && (
        <span className="text-sm text-muted-foreground ml-2">
          (≈ {price.toFixed(2)} {baseCurrency})
        </span>
      )}
    </div>
  )
}
