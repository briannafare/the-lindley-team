# Mortgage Calculator Suite — Brand Reskin Guide

## What's in this package

17 production mortgage calculators built with Next.js 14, TypeScript, and Tailwind CSS:

| Calculator | Route | Engine |
|---|---|---|
| Conventional | `/conventional` | MI via Arch rate tables |
| FHA | `/fha` | Upfront + annual MIP |
| VA | `/va` | VA funding fee engine |
| USDA | `/usda` | USDA guarantee fee |
| Refinance Break-Even | `/refinance` | Break-even timeline |
| Cash to Close | `/cash-to-close` | Itemized closing costs |
| CLTV & Blended Rate | `/cltv` | Multi-lien blending |
| Tax Deduction Estimator | `/tax-deduction` | Standard vs. itemized |
| Rent vs. Buy | `/rent-vs-buy` | 10-year comparison |
| Buy Now vs. Wait | `/buy-now-vs-wait` | Appreciation + rate modeling |
| Move-Up Buyer | `/move-up` | Current equity → new loan |
| Investment Property | `/investment` | Cash flow, cap rate, CoC |
| DSCR | `/dscr` | Debt service coverage |
| House Hacking | `/house-hacking` | Multi-unit rental offset |
| Payment Strategy | `/payment-strategy` | Extra payments + biweekly |
| Debt Consolidation Refi | `/debt-consolidation` | Roll debts into mortgage |
| Affordability | `/affordability` | DTI-based max purchase |

## Getting it running

```bash
npm install
npm run dev
# → http://localhost:3000/conventional
```

---

## Reskin checklist — everything that needs to change

### 1. Brand metadata (one file)

**`app/layout.tsx`**

```tsx
// Change these two strings:
title: "Mortgage Calculator | Movement Mortgage",
description: "Estimate your monthly mortgage payment..."
```

### 2. Primary brand color (one file)

**`tailwind.config.ts`** → `theme.extend.colors`

```ts
accent: {
  DEFAULT: "#2563EB",   // ← Replace with new primary brand color
  light: "#DBEAFE",     // ← Light tint of brand color (hover/focus states)
  dark: "#1D4ED8",      // ← Dark shade (active/pressed states)
},
```

Also in the same file — the input focus ring uses accent:
```ts
"input-focus": "0 0 0 3px rgba(37,99,235,0.12)",
//                          ^^^^^^^^^^^^^^^^ match to new accent
```

### 3. Neutral palette (optional, same file)

The `surface-*` and `ink-*` scales are warm grays. Replace if the brand uses cool grays, warm tones, etc:

```ts
surface: { 50: "#FAFAFA", 100: "#F5F5F5", 200: "#EEEEEE", 300: "#E0E0E0" },
ink:     { 900: "#1A1A1A", 700: "#404040", 500: "#737373", 400: "#9CA3AF", 300: "#BFBFBF" },
```

### 4. Fonts (same file)

```ts
fontFamily: {
  display: ["SF Pro Display", ...],  // ← Heading font
  body: ["SF Pro Text", ...],        // ← Body font
}
```

Replace with the brand's font stack. If using Google Fonts or a custom font, also update `app/layout.tsx` to load it.

### 5. Chart & data visualization colors (hardcoded in page files)

These are the semantic colors used across donut charts, bar charts, breakdown rows, and amortization charts. They appear as inline hex values in the calculator page files.

**Payment breakdown palette** (used in Conventional, FHA, VA, USDA):
```
#059669  →  Principal & Interest (green)
#6366F1  →  Mortgage Insurance (indigo)
#0EA5E9  →  Property Tax (sky blue)
#F59E0B  →  Insurance (amber)
#8B5CF6  →  HOA (purple)
```

Search for `breakdownColors` in these files:
- `app/conventional/page.tsx`
- `app/fha/page.tsx`
- `app/va/page.tsx`
- `app/usda/page.tsx`

**Debt consolidation palette** (`app/debt-consolidation/page.tsx`):
```
const DEBT_COLORS = ["#2563eb", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];
```

**House hacking unit colors** (`app/house-hacking/page.tsx`):
```
const UNIT_COLORS = ["#059669", "#2563eb", "#d97706", "#dc2626"];
```

**Amortization chart** (`components/AmortizationChart.tsx`):
```
#059669  →  Principal area/stroke (green)
#0EA5E9  →  Interest area/stroke (sky blue)
```

**Status/result colors** (scattered across all page files):
```
#059669  →  Positive/good values (green — e.g. savings, equity)
#dc2626  →  Negative/warning values (red — e.g. over DTI)
#d97706  →  Caution values (amber)
#2563eb  →  Accent/highlight values (blue — matches accent)
```

**To find every instance**, run:
```bash
grep -rn '#059669\|#0EA5E9\|#6366F1\|#F59E0B\|#8B5CF6\|#dc2626\|#d97706\|#2563eb\|#7c3aed\|#0891b2\|#0891B2' app/ components/
```

### 6. Global CSS (one file)

**`app/globals.css`** — component classes. These reference Tailwind tokens, so if you update `tailwind.config.ts` they'll cascade automatically. The `::selection` color is hardcoded and should match accent:

```css
::selection {
  background-color: #DBEAFE;  /* ← accent.light */
  color: #1D4ED8;             /* ← accent.dark */
}
```

---

## Architecture (don't touch)

Everything under `lib/calculators/` is pure math — rate tables, amortization engines, MI/MIP/funding fee lookups. No brand, no UI, no colors. These should not need any changes for a reskin.

`lib/format.ts` is currency/date formatting. Also brand-independent.

---

## File inventory

```
app/                          17 calculator routes + layout + globals
components/AmortizationChart.tsx   shared chart (recharts)
lib/calculators/              22 pure TypeScript calculation engines
lib/format.ts                 formatting utilities
tailwind.config.ts            design tokens (THIS IS THE MAIN BRAND FILE)
```
