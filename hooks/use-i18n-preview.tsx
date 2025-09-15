"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { type Locale, defaultLocale, getMessages } from "@/lib/i18n-preview"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Check URL params first, then localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const urlLocale = urlParams.get("lang") as Locale
    const savedLocale = localStorage.getItem("locale") as Locale

    if (urlLocale && ["en", "ro", "hu", "de"].includes(urlLocale)) {
      setLocaleState(urlLocale)
      localStorage.setItem("locale", urlLocale)
    } else if (savedLocale && ["en", "ro", "hu", "de"].includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)

    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set("lang", newLocale)
    window.history.replaceState({}, "", url.toString())
  }

  const t = (key: string): string => {
    const messages = getMessages(locale)
    const keys = key.split(".")
    let value: any = messages

    for (const k of keys) {
      value = value?.[k]
    }

    return typeof value === "string" ? value : key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}
