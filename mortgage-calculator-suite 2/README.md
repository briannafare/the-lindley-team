# Mortgage Calculator Suite

A production-quality mortgage calculator suite built with Next.js 14, TypeScript, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/conventional` to see the first calculator.

## Project Structure

```
mortgage-calc/
├── app/                          # Next.js App Router pages
│   ├── conventional/page.tsx     # Conventional loan calculator (built)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Redirects to /conventional
├── components/                   # React components
│   └── AmortizationChart.tsx     # Recharts amortization chart
├── lib/
│   ├── calculators/              # Pure TypeScript calculation engines
│   │   ├── types.ts              # Shared types
│   │   ├── amortization.ts       # P&I, amortization schedule, total interest
│   │   ├── mi-arch.ts            # Arch MI rate engine + adjustments
│   │   ├── conventional.ts       # Conventional calculator orchestrator
│   │   └── index.ts              # Barrel export
│   └── format.ts                 # Currency, percent, date formatters
├── skills/                       # Claude Code skill for building calculators
│   └── mortgage-calculator-suite/
│       ├── SKILL.md              # Main skill instructions
│       └── references/           # Detailed specs and design tokens
│           ├── calculator-specs.md
│           ├── design-tokens.md
│           └── shared-components.md
├── tailwind.config.ts            # Custom design tokens
└── package.json
```

## Building New Calculators

This project includes a Claude Code skill in `skills/mortgage-calculator-suite/`.

To add a new calculator in Claude Code:
1. Open Claude Code in this project directory
2. Install the skill from `skills/mortgage-calculator-suite/`
3. Say: "Build the VA calculator" (or any of the 15 remaining calculators)

The skill contains complete specs for all 16 calculators, the design system, shared component APIs, and the three-layer architecture pattern.

## Calculators Planned

1. ✅ Conventional Payment (`/conventional`)
2. VA Loan Payment (`/va`)
3. FHA Loan Payment (`/fha`)
4. USDA Loan Payment (`/usda`)
5. Refinance Break-Even (`/refinance`)
6. Home Equity / HELOC (`/home-equity`)
7. CLTV & Blended Rate (`/cltv`)
8. Total Cash to Close (`/cash-to-close`)
9. Tax Deduction Estimator (`/tax-deduction`)
10. Rent vs Buy (`/rent-vs-buy`)
11. Buy Now vs Wait (`/buy-now-vs-wait`)
12. Move-Up Buyer (`/move-up`)
13. Investment Property (`/investment`)
14. DSCR (`/dscr`)
15. House Hacking (`/house-hacking`)
16. Payment Strategy Optimizer (`/payment-strategy`)
17. Debt Consolidation Refi (`/debt-consolidation`)
18. Affordability (`/affordability`)

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (custom design tokens)
- Recharts (amortization charts)
- React Hook Form + Zod (complex form validation)
