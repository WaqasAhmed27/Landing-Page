# STATE.md — Landing Page

> Last updated: 2026-08-04. Pre-deployment audit and final configuration complete. Verified in Phase 4.

---

## 1. Overview

The `Landing-Page` is TapTile's public-facing marketing website, built with Vite + React 19 + TypeScript. It is a single-page application (SPA) designed for zero-backend static deployment — all content is static, fast, and SEO-optimized. Its role in the Taptile ecosystem is presentational and lead generation: it introduces TapTile to prospective retailers, explains the value proposition (digital receipts, FBR compliance, environmental impact), and provides a fully interactive POS compatibility lead form. The design language is neobrutalist — thick black borders, hard box shadows, uppercase typography — and uses an interactive chameleon mascot (`chameleon_*.png`) trail effect.

---

## 2. Current Status

**Production Ready for Deployment — Fully audited, verified, and configured.**

Verification:
- **Build & Types**: Passes `npm run lint` (`tsc --noEmit`) with 0 errors. Builds cleanly with `npm run build` (`dist/`).
- **SEO & Social Sharing**: Complete meta tags added to [index.html](file:///e:/OneDrive/Desktop/TapTile%20Org/Landing-Page/index.html) including title, meta description, Open Graph, Twitter Cards, canonical link, and SVG favicon (`public/favicon.svg`).
- **Section Navigation**: All sections feature explicit IDs (`#platform`, `#integration`, `#pricing`, `#security`, `#contact`) with smooth scrolling on all header links, mobile menu items, and CTAs ("Book a Demo", "Start Your Free Pilot", "Check POS Compatibility").
- **Lead Generation Form**: Managed form state with input validation, submitting/success/error states, reset action, and configurable API endpoint via `VITE_CONTACT_API_URL`.
- **Clean Repository**: Unused `@google/genai` dependency removed from `package.json`, stale `landingpage.zip` (4.5 MB) purged from repository root, `.env.example` created and documented.

---

## 3. What's Implemented

- **Complete Landing Page Layout** — Hero, Platform Overview, Integration Flow, Savings Calculator, Security, FAQ Accordion, Get in Touch form, and Footer.
- **Full SEO & Social Open Graph Infrastructure** — Custom `favicon.svg`, Open Graph tags (`og:title`, `og:description`, `og:image`), Twitter Card metadata, and canonical links.
- **Interactive Section Navigation** — Smooth-scrolling anchors on all header links, mobile menu items, and CTA buttons.
- **Wired Lead Generation Form** — Captures Business Name, Contact Email, City, and POS Software with validation, submit state, and fallback demo confirmation box.
- **Animated Chameleon Trail** (`TrailCanvas.tsx`) — Cursor-following interactive image trail powered by GSAP and Framer Motion.
- **Responsive Design System** — Built with Tailwind v4, responsive breakpoints across mobile, tablet, and desktop screens.
- **Clean Build Pipeline** — Configured for Vite static SPA build (`dist/`) or Node server fallback ([server.js](file:///e:/OneDrive/Desktop/TapTile%20Org/Landing-Page/server.js)).

---

## 4. Required & Optional Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_CONTACT_API_URL` | ⚠️ Optional | Custom endpoint URL for receiving lead form submissions (e.g. Formspree, Web3Forms, Resend, or TapTile Backend). Operates in demo mode if unconfigured. |
| `DISABLE_HMR` | ⚠️ Optional | Set to `"true"` to disable Vite HMR (used in AI-assisted editing environments). |

**`.env.example` exists:** ✅ Yes.

---

## 5. How to Run & Build

```bash
# 1. Install dependencies
npm install

# 2. Start dev server on port 3000
npm run dev

# 3. Type-check without emitting
npm run lint   # (runs tsc --noEmit)

# 4. Build for production distribution
npm run build  # (outputs static site to dist/)

# 5. Preview production build locally
npm run preview
```

---

## 6. Dependencies on Other Taptile Projects

**None.** The landing page is entirely self-contained — it requires zero runtime API or database dependencies.

See `ARCHITECTURE.md` for the monorepo dependency map.
