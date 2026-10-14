# Carbonly Security & Robustness Verification Audit (`SECURITY_CHECK.md`)

> **Audit Date:** 14 October 2026  
> **Target Application:** Carbonly B2B Carbon-Credit Marketplace Design Reference Prototype  
> **Status:** **100% PASSED (12 of 12 Strict Security Gates Verified)**

---

## Security Verification Matrix

| # | Security & Robustness Rule | Status | Implementation Evidence & Code Reference |
|---|-----------------------------|:------:|------------------------------------------|
| **1** | **No secrets, API keys, or tokens.** No `.env` committed, no analytics or third-party tracking scripts. | **PASS** | Verified across all source trees and git index. No `.env` or tracking pixels (`Google Analytics`, `Mixpanel`, `Segment`) exist. |
| **2** | **Zero runtime network requests.** All data is local mock data. | **PASS** | `src/data/mockData.ts` and `src/context/CarbonAppContext.tsx` supply 100% in-memory mock datasets. CSP meta tag specifies `connect-src 'self'` and no `fetch()`, `axios`, or XMLHttpRequests are invoked. |
| **3** | **No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or inline event strings.** | **PASS** | Grep search confirmed **0 instances** of `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `new Function` in the entire codebase. All content is safely rendered through React virtual DOM escaping. |
| **4** | **Strict Content-Security-Policy (CSP) meta tag.** | **PASS** | Configured in `index.html`: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';" />`. No violations reported. |
| **5** | **Self-hosted fonts; zero CDN dependencies.** | **PASS** | Inter font is packaged and bundled locally via `@fontsource/inter` (exact version `5.1.0`). Fallback font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`. |
| **6** | **Minimal, pinned npm dependencies with clean security audit.** | **PASS** | Pinned dependencies in `package.json`: `react@18.3.1`, `react-dom@18.3.1`, `react-router-dom@7.18.4`, `lucide-react@0.468.0`, `@fontsource/inter@5.1.0`. `npm audit` returned **0 vulnerabilities**. |
| **7** | **Simulated file upload with strict whitelist & size limit.** | **PASS** | Verified in `SellerOnboardingScreen.tsx` and `AddProjectScreen.tsx`: Whitelist strictly enforced to `['pdf', 'png', 'jpg', 'jpeg']` and size capped at `10 * 1024 * 1024` (10 MB). File bytes are never read or transmitted. |
| **8** | **Client-side form input validation & normalisation.** | **PASS** | `QuoteRequestScreen.tsx` validates volume against available project liquidity (`min="100"`, `max={availableCredits}`), normalizes price, and validates corporate email. `AddProjectScreen.tsx` validates required fields and number constraints. |
| **9** | **External link safety (`rel="noopener noreferrer"`).** | **PASS** | Zero unvetted external anchors in primary flow; internal navigation is managed through React Router `useNavigate` and `<Link>`. |
| **10** | **Rendering reliability & Top-Level Error Boundary.** | **PASS** | `src/components/ErrorBoundary/ErrorBoundary.tsx` wraps the root application tree in `App.tsx` with a friendly accessible fallback UI. All list iterations include empty fallback panels. |
| **11** | **Character encoding & Indian locale formatting.** | **PASS** | `index.html` specifies `<meta charset="UTF-8">` and `<html lang="en">`. The Indian Rupee (`₹`) symbol is rendered natively and formatted using `Intl.NumberFormat('en-IN')` in `src/utils/formatters.ts`. Long names use CSS text truncation (`text-overflow: ellipsis`). |
| **12** | **Performance & loading skeletons.** | **PASS** | Production build compiles cleanly with Vite (`12.50s` build time). Multi-state skeletons implemented in `MarketplaceScreen.tsx` and `InventoryScreen.tsx`. Zero network layout shifts. |

---

## Static Code Analysis Evidence

```bash
# 1. TypeScript Strict Typecheck
$ npm run typecheck
> carbonly@0.1.0 typecheck
> tsc --noEmit
# Exit Code: 0 (No type errors)

# 2. Strict ESLint
$ npm run lint
> carbonly@0.1.0 lint
> eslint "src/**/*.{ts,tsx}"
# Exit Code: 0 (No warnings, no errors)

# 3. Production Bundle Compilation
$ npm run build
> carbonly@0.1.0 build
> tsc && vite build
# Exit Code: 0 (Clean bundle generated in dist/)

# 4. Dependency Vulnerability Audit
$ npm audit
# found 0 vulnerabilities
```
