export interface CurrencyRate {
  id: string
  from_currency: string
  to_currency: string
  rate: number
  effective_date: string
  created_at: string
}

export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  decimal_places: number
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", decimal_places: 2 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", decimal_places: 2 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", decimal_places: 2 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", decimal_places: 0 },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", decimal_places: 2 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", decimal_places: 2 },
}

export function formatCurrency(amount: number, currencyCode = "USD", locale = "en-US"): string {
  const currency = SUPPORTED_CURRENCIES[currencyCode]
  if (!currency) {
    return `${amount.toFixed(2)} ${currencyCode}`
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: currency.decimal_places,
      maximumFractionDigits: currency.decimal_places,
    }).format(amount)
  } catch (error) {
    // Fallback formatting
    return `${currency.symbol}${amount.toFixed(currency.decimal_places)}`
  }
}

export function convertPrice(
  basePrice: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate?: number,
): number {
  if (fromCurrency === toCurrency) {
    return basePrice
  }

  if (exchangeRate) {
    return basePrice * exchangeRate
  }

  // Fallback to 1:1 conversion if no rate provided
  return basePrice
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES[currencyCode]
  return currency?.symbol || currencyCode
}

export function parseCurrencyAmount(formattedAmount: string, currencyCode = "USD"): number {
  const currency = SUPPORTED_CURRENCIES[currencyCode]
  if (!currency) return 0

  // Remove currency symbol and formatting
  const cleanAmount = formattedAmount.replace(currency.symbol, "").replace(/[,\s]/g, "").trim()

  const parsed = Number.parseFloat(cleanAmount)
  return isNaN(parsed) ? 0 : parsed
}
