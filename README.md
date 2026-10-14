# Carbonly – B2B Carbon-Credit Marketplace Reference Prototype

> **Interactive Design Reference Prototype for Figma Handoff**  
> Built strictly to the **Carbonly Master Prompt Specification**.  
> Features **18 production-grade screens**, an interactive **Design System showroom**, role-based persona navigation (Buyer, Seller, Admin), and a 100% clickable end-to-end primary flow with shared in-memory state.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Launch
```bash
# 1. Install dependencies (pinned, minimal)
npm install

# 2. Start the local development server
npm run dev

# 3. Open your browser at:
# http://localhost:5173
```

### Quality & Security Verification Scripts
```bash
# Typecheck (Strict TypeScript - 0 errors)
npm run typecheck

# Lint (Strict ESLint - 0 errors, 0 warnings)
npm run lint

# Production Build (Vite - bundles self-hosted fonts)
npm run build

# Security Audit (0 vulnerabilities)
npm audit
```

---

## 👥 Personas & Role Switcher

Use the **demo role switcher dropdown** located in the top navigation bar to seamlessly toggle between personas:

1. **Buyer Persona**
   - **Top Nav:** Dashboard, Marketplace, Compare, Quotes, Portfolio, Reports
   - **Key Features:** Faceted search, project comparisons (zero auto-ranking), RFP quotes, portfolio management, permanent credit retirement, verifiable cryptographic certificates, and SEBI BRSR reports.

2. **Seller Persona**
   - **Top Nav:** Dashboard, Projects, Inventory, Inquiries
   - **Key Features:** 6-step onboarding wizard, inventory ledger by batch number, new project listing form with simulated upload, buyer inquiry inbox with counter-quoting.

3. **Admin Persona**
   - **Top Nav:** Dashboard, Verification, Listings, Users & Transactions
   - **Key Features:** Seller corporate KYC review panel, 5-point methodological integrity checklist, dual-tab user & transaction audit logs.

---

## 🔄 Primary Clickable Flow (End-to-End)

The full primary procurement and retirement flow is clickable with real-time shared state:

1. **Marketplace (`/marketplace`)**: Browse verified Indian carbon projects. Click **"Compare"** on 2–4 projects to add them to your comparison shortlist, or click **"View Project"**.
2. **Project Detail (`/project/:id`)**: Inspect the 4-step lifecycle stepper, 6-month spot price trend chart, and documentation checklist. Click **"Request Enterprise Quote"**.
3. **Compare Matrix (`/compare`)**: Side-by-side neutral comparison of 2–4 shortlisted projects.
4. **Quote Request Form (`/quotes/request/:projectId`)**: Enter volume and target price in INR (`₹`). The dynamic summary calculates total settlement value. Submit the RFP.
5. **Quote Tracking (`/quotes`)**: View the new RFP in `Pending` or inspect existing `Responded` quotes. Click **"Accept Offer"** to execute simulated escrow settlement!
6. **Portfolio (`/portfolio`)**: Notice the purchased credits added to your active holdings. Click **"Retire"** on any holding to launch the accessible confirmation dialog.
7. **Retirement Certificate (`/certificate/:id`)**: Complete retirement to instantly generate an official certificate with a unique certificate ID, serial range, blockchain transaction hash, and printable layout.
8. **ESG Reports (`/reports`)**: View the newly retired volume reflected across cumulative carbon offsets, monthly retirement velocity, and GHG Protocol scopes.

---

## 🎨 Design Direction & Token Highlights

- **Palette (CSS Variables Only):**
  - Deep Green (`#16342B`), Forest Green (`#2D6A4F`), Accent Green (`#40916C`), Dark Blue (`#1B3A57`), Light Neutral (`#EEF2ED`), White (`#FFFFFF`).
- **Restrained Green Rule:** Green is used strictly for primary CTAs, positive status pills, and key metrics. The application never feels green overall.
- **Typography:** Self-hosted Inter font via `@fontsource/inter` with system-font fallback stack.
- **Accessibility:** WCAG AA contrast, visible focus rings (`:focus-visible`), aria landmarks, accessible modals, and full keyboard navigation.
- **Numbers & Currency:** Indian Rupee symbol (`₹`) formatted with `Intl.NumberFormat('en-IN')` (e.g. `₹1,20,000`).

---

## 📁 Key Documentation Files

- [`DAILY_UPDATES.md`](file:///c:/Users/nevil/Desktop/corbon/DAILY_UPDATES.md): Copy-paste ready daily standup messages for Phase A through Phase E.
- [`HANDOFF.md`](file:///c:/Users/nevil/Desktop/corbon/HANDOFF.md): Comprehensive Figma design handoff specs, design tokens, and 18-screen mapping.
- [`SECURITY_CHECK.md`](file:///c:/Users/nevil/Desktop/corbon/SECURITY_CHECK.md): Audit verification report proving 100% compliance with the 12 strict security rules.
- [`/design-system`](http://localhost:5173/design-system): Live interactive showroom of all tokens and components.
