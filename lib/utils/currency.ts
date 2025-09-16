/**
 * Currency formatting utilities
 */

export function formatCurrency(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPrice(amount: number, currency = "USD"): string {
  return formatCurrency(amount, currency)
}

export function parseCurrency(formattedAmount: string): number {
  // Remove currency symbols and parse as float
  const numericValue = formattedAmount.replace(/[^0-9.-]+/g, "")
  return Number.parseFloat(numericValue) || 0
}
