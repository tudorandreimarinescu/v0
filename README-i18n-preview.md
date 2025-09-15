# Preview-Compatible Internationalization Setup

## Overview
This implementation provides full internationalization support that works within v0's preview environment, bypassing the limitations with next-intl middleware.

## Features Working in Preview
- ✅ Language switching (EN, RO, HU, DE)
- ✅ Currency switching (RON, EUR, HUF, GBP)
- ✅ Persistent preferences (localStorage + cookies)
- ✅ Real-time text updates
- ✅ URL parameter support (?lang=ro)

## How to Test
1. **Language Switching**: Click the globe icon in the header
2. **Currency Switching**: Click the dollar icon in the header
3. **URL Testing**: Add `?lang=ro` to the URL
4. **Persistence**: Refresh page - settings are remembered

## Technical Implementation
- **Custom i18n System**: `lib/i18n-preview.ts` + `hooks/use-i18n-preview.ts`
- **No Middleware**: Uses client-side routing instead
- **Embedded Messages**: All translations included in bundle
- **Fallback Support**: Graceful degradation to English

## For Production
To use the full next-intl setup in production:
1. Download the project
2. Run `npm install`
3. The full middleware-based routing will work locally

## Files Modified
- `app/layout.tsx` - Added I18nProvider
- `components/*` - Updated to use preview-compatible hooks
- `lib/i18n-preview.ts` - Custom i18n implementation
- `hooks/use-i18n-preview.ts` - Preview-compatible hooks
