export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
}

export const currencies: Currency[] = [
  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
]

export function formatPrice(amount: number, currencyCode = "EUR", locale = "en"): string {
  const currency = currencies.find((c) => c.code === currencyCode)

  if (!currency) {
    return `${amount} ${currencyCode}`
  }

  // Special formatting for different currencies
  switch (currencyCode) {
    case "RON":
      return (
        new Intl.NumberFormat("ro-RO", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + " lei"
      )

    case "HUF":
      // Hungarian Forint typically doesn't use decimals
      return (
        new Intl.NumberFormat("hu-HU", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount) + " Ft"
      )

    case "EUR":
      return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-EU", {
        style: "currency",
        currency: "EUR",
      }).format(amount)

    case "GBP":
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(amount)

    default:
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
      }).format(amount)
  }
}

// Hook for getting current currency from cookie
export function getCurrentCurrency(): string {
  if (typeof window === "undefined") return "EUR"

  const savedCurrency = document.cookie
    .split("; ")
    .find((row) => row.startsWith("preferred-currency="))
    ?.split("=")[1]

  return savedCurrency && currencies.find((c) => c.code === savedCurrency) ? savedCurrency : "EUR"
}
