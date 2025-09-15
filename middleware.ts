import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./i18n/request"
import { updateSession } from "./lib/supabase/middleware"
import type { NextRequest } from "next/server"

export default async function middleware(request: NextRequest) {
  // First handle Supabase session management
  const supabaseResponse = await updateSession(request)

  // If Supabase middleware returned a redirect, return it
  if (supabaseResponse.status === 302) {
    return supabaseResponse
  }

  // Then handle internationalization
  const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: "always",
  })

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/", "/(de|en|ro|hu)/:path*", "/((?!api|_next|_vercel|.*\\..*).*))"],
}
