// Simple fallback i18n system
const messages = {
  "nav.shop": "Shop",
  "nav.cart": "Cart",
  "nav.contact": "Contact",
  "hero.badge": "✨ New Paper Shaders Experience",
  "hero.title": "Revolutionary Shader Effects for Modern Design",
  "hero.subtitle":
    "Transform your creative projects with our premium collection of paper-inspired shader effects. Perfect for web design, digital art, and interactive experiences.",
  "hero.cta": "Explore Shaders",
  "hero.secondary": "View Gallery",
  "trust.shipping": "Discreet shipping",
  "trust.payments": "Secure payments",
  "trust.age": "18+ only",
  "footer.company": "Company",
  "footer.about": "About Us",
  "footer.careers": "Careers",
  "footer.press": "Press",
  "footer.support": "Support",
  "footer.help": "Help Center",
  "footer.contact": "Contact",
  "footer.faq": "FAQ",
  "footer.legal": "Legal",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.returns": "Returns",
  "footer.newsletter": "Stay updated with our latest shader releases",
  "footer.subscribe": "Subscribe",
  "footer.rights": "All rights reserved.",
  "shop.addToCart": "Add to Cart",
  "shop.quickView": "Quick View",
}

export function useSimpleTranslations() {
  return function t(key: string): string {
    return messages[key as keyof typeof messages] || key
  }
}
