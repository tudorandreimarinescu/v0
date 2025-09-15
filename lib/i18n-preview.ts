export type Locale = "en" | "ro" | "hu" | "de"

export const locales: Locale[] = ["en", "ro", "hu", "de"]
export const defaultLocale: Locale = "en"

export const localeNames = {
  en: "English",
  ro: "Română",
  hu: "Magyar",
  de: "Deutsch",
} as const

export const localeFlags = {
  en: "🇬🇧",
  ro: "🇷🇴",
  hu: "🇭🇺",
  de: "🇩🇪",
} as const

// Translation messages embedded for preview compatibility
export const messages = {
  en: {
    nav: {
      shop: "Shop",
      cart: "Cart",
      contact: "Contact",
    },
    hero: {
      badge: "✨ New Paper Shaders Experience",
      title: "Revolutionary Shader Effects for Modern Design",
      subtitle:
        "Transform your creative projects with our premium collection of paper-inspired shader effects. Perfect for web design, digital art, and interactive experiences.",
      cta: "Explore Shaders",
      secondary: "View Gallery",
    },
    trust: {
      shipping: "Discreet shipping",
      payments: "Secure payments",
      age: "18+ only",
    },
    footer: {
      company: "Company",
      about: "About Us",
      careers: "Careers",
      press: "Press",
      support: "Support",
      help: "Help Center",
      contact: "Contact",
      faq: "FAQ",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      returns: "Returns",
      newsletter: "Stay updated with our latest shader releases",
      subscribe: "Subscribe",
      rights: "All rights reserved.",
    },
    currency: {
      label: "Currency",
    },
  },
  ro: {
    nav: {
      shop: "Magazin",
      cart: "Coș",
      contact: "Contact",
    },
    hero: {
      badge: "✨ Noua Experiență Paper Shaders",
      title: "Efecte Shader Revoluționare pentru Design Modern",
      subtitle:
        "Transformă-ți proiectele creative cu colecția noastră premium de efecte shader inspirate de hârtie. Perfect pentru web design, artă digitală și experiențe interactive.",
      cta: "Explorează Shader-ele",
      secondary: "Vezi Galeria",
    },
    trust: {
      shipping: "Livrare discretă",
      payments: "Plăți securizate",
      age: "Doar 18+",
    },
    footer: {
      company: "Companie",
      about: "Despre Noi",
      careers: "Cariere",
      press: "Presă",
      support: "Suport",
      help: "Centru de Ajutor",
      contact: "Contact",
      faq: "Întrebări Frecvente",
      legal: "Legal",
      privacy: "Politica de Confidențialitate",
      terms: "Termeni și Condiții",
      returns: "Returnări",
      newsletter: "Rămâi la curent cu cele mai noi lansări de shader-e",
      subscribe: "Abonează-te",
      rights: "Toate drepturile rezervate.",
    },
    currency: {
      label: "Monedă",
    },
  },
  hu: {
    nav: {
      shop: "Bolt",
      cart: "Kosár",
      contact: "Kapcsolat",
    },
    hero: {
      badge: "✨ Új Paper Shaders Élmény",
      title: "Forradalmi Shader Effektek Modern Designhoz",
      subtitle:
        "Alakítsd át kreatív projektjeidet prémium papír-inspirált shader effekt kollekciónkkal. Tökéletes webdesignhoz, digitális művészethez és interaktív élményekhez.",
      cta: "Shaderek Felfedezése",
      secondary: "Galéria Megtekintése",
    },
    trust: {
      shipping: "Diszkrét szállítás",
      payments: "Biztonságos fizetés",
      age: "Csak 18+",
    },
    footer: {
      company: "Cég",
      about: "Rólunk",
      careers: "Karrier",
      press: "Sajtó",
      support: "Támogatás",
      help: "Segítségközpont",
      contact: "Kapcsolat",
      faq: "GYIK",
      legal: "Jogi",
      privacy: "Adatvédelmi Irányelvek",
      terms: "Felhasználási Feltételek",
      returns: "Visszaküldések",
      newsletter: "Maradj naprakész a legújabb shader kiadásainkkal",
      subscribe: "Feliratkozás",
      rights: "Minden jog fenntartva.",
    },
    currency: {
      label: "Pénznem",
    },
  },
  de: {
    nav: {
      shop: "Shop",
      cart: "Warenkorb",
      contact: "Kontakt",
    },
    hero: {
      badge: "✨ Neue Paper Shaders Erfahrung",
      title: "Revolutionäre Shader-Effekte für Modernes Design",
      subtitle:
        "Verwandle deine kreativen Projekte mit unserer Premium-Kollektion papier-inspirierter Shader-Effekte. Perfekt für Webdesign, digitale Kunst und interaktive Erlebnisse.",
      cta: "Shader Erkunden",
      secondary: "Galerie Ansehen",
    },
    trust: {
      shipping: "Diskreter Versand",
      payments: "Sichere Zahlungen",
      age: "Nur 18+",
    },
    footer: {
      company: "Unternehmen",
      about: "Über Uns",
      careers: "Karriere",
      press: "Presse",
      support: "Support",
      help: "Hilfezentrum",
      contact: "Kontakt",
      faq: "FAQ",
      legal: "Rechtliches",
      privacy: "Datenschutzrichtlinie",
      terms: "Nutzungsbedingungen",
      returns: "Rücksendungen",
      newsletter: "Bleibe auf dem Laufenden mit unseren neuesten Shader-Veröffentlichungen",
      subscribe: "Abonnieren",
      rights: "Alle Rechte vorbehalten.",
    },
    currency: {
      label: "Währung",
    },
  },
} as const

export function getMessages(locale: Locale) {
  return messages[locale] || messages[defaultLocale]
}
