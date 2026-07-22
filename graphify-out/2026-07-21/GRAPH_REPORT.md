# Graph Report - the-lindley-team  (2026-07-21)

## Corpus Check
- 184 files · ~561,117 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1164 nodes · 1691 edges · 102 communities (82 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bb08a5fd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Neighborhood Experience
- Core Conversion Pages
- Homepage Experience
- Journal and Discovery
- Lead Capture Flow
- Journal Index
- Calculator and Loans
- Global App Shell
- Core Loan Products
- Service Page System
- Navigation and Construction
- Services Directory
- USDA Product Data
- Calculator Content
- Motion Utilities
- Jumbo Loans
- Reverse Mortgages
- DSCR Loans
- VA Loans
- Refinance Loans
- Investment Loans
- Purchase Loans
- HELOC Loans
- FHA Loans
- Service Marquee
- Neighborhood Grid
- Search Crawling
- Primary CTA
- Featured Neighborhoods
- Brand Mission
- Trust Statistics
- rent-vs-buy.ts
- The Lindley Team — First-Touch Agent Prompts (source of truth)
- page.tsx
- Nav.tsx
- 3. Core reference (the "Services & Business Info" source)
- Reskin checklist — everything that needs to change
- page.tsx
- va.ts
- The Lindley Team → Movement Mortgage — Copy Rebrand Spec & Change Log
- page.tsx
- page.tsx
- fha.ts
- fha.ts
- tax-deduction.ts
- layout.tsx
- affordability.ts
- debt-consolidation.ts
- payment-strategy.ts
- 1. New Lead Nurture (Fast 5) - Claim Offer
- lindley-new-copy-deck.md
- Mortgage Calculator Suite
- Accessibility Review — WCAG 2.1 AA
- 2. Appointment Confirmation + Reminders
- 5. Long-Term Nurture
- Compliance Archive — MAP Rule / Reg N (12 CFR 1014)
- Compliance Review — thelindleyteam.com
- The Lindley Team — Conversation AI (chat/SMS) + Voice AI (source of truth)
- page.tsx
- cash-to-close.ts
- cltv.ts
- 3. Appt No Show
- INDEX.md
- wh-apply-click
- wh-appointment-booked
- wh-calculator
- wh-divorce-consult
- wh-first-time-buyer
- wh-guide-download
- wh-neighborhood
- wh-rate-quote
- wh-schedule-call
- compliance-export.py
- move-up.ts
- extends
- layout.tsx
- README.md
- animations.ts
- Handoff → Claude Code (terminal): build the GHL backend + wire it to the site
- The Lindley Team — Conversation AI System Prompt
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- Marquee.tsx
- NeighborhoodGrid.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- next.config.mjs
- postcss.config.mjs
- Stats.tsx
- tailwind.config.ts
- June's Knowledge Base — operational pack
- June — Voice Agent-1 (GHL Voice AI) — deployable config

## God Nodes (most connected - your core abstractions)
1. `formatCurrency()` - 36 edges
2. `formatCurrencyPrecise()` - 31 edges
3. `calculateMonthlyPi()` - 26 edges
4. `calculateMonthlyPi()` - 26 edges
5. `buildAmortizationSchedule()` - 19 edges
6. `getServiceBySlug()` - 17 edges
7. `compilerOptions` - 15 edges
8. `compilerOptions` - 15 edges
9. `The Lindley Team — GHL Implementation Playbook` - 14 edges
10. `buildAmortizationSchedule()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `ScenarioCard()` --calls--> `formatCurrency()`  [EXTRACTED]
  mortgage-calculator-suite 2/app/buy-now-vs-wait/page.tsx → mortgage-calculator-suite 2/lib/format.ts
- `WaterfallRow()` --calls--> `formatCurrencyPrecise()`  [EXTRACTED]
  mortgage-calculator-suite 2/app/cash-to-close/page.tsx → mortgage-calculator-suite 2/lib/format.ts
- `ScenarioCard()` --calls--> `formatCurrency()`  [EXTRACTED]
  mortgage-calculator-suite 2/app/cash-to-close/page.tsx → mortgage-calculator-suite 2/lib/format.ts
- `BreakdownRow()` --calls--> `formatCurrencyPrecise()`  [EXTRACTED]
  mortgage-calculator-suite 2/app/fha/page.tsx → mortgage-calculator-suite 2/lib/format.ts
- `PaymentDonut()` --calls--> `formatCurrency()`  [EXTRACTED]
  mortgage-calculator-suite 2/app/fha/page.tsx → mortgage-calculator-suite 2/lib/format.ts

## Import Cycles
- None detected.

## Communities (102 total, 20 thin omitted)

### Community 0 - "Neighborhood Experience"
Cohesion: 0.05
Nodes (42): eslint, eslint-config-next, gsap, @gsap/react, marked, dependencies, gsap, @gsap/react (+34 more)

### Community 1 - "Core Conversion Pages"
Cohesion: 0.06
Nodes (24): FILING_OPTIONS, RentVsBuyChart(), RentVsBuyPage(), TERM_OPTIONS, FILING_OPTIONS, annualInterestForYear(), BRACKETS, calculateRentVsBuy() (+16 more)

### Community 2 - "Homepage Experience"
Cohesion: 0.07
Nodes (19): metadata, FAQ, metadata, REASSURANCE, STEPS, Btn(), SIZES, VARIANTS (+11 more)

### Community 3 - "Journal and Discovery"
Cohesion: 0.05
Nodes (36): AI CHAT WIDGET, Capture Method:, Chat → Lead Flow:, Configuration:, Context-Aware Greetings:, Environment Variable:, Every form, every webhook, every sequence, every pipeline stage, Form 1: Get Pre-Approved (Primary CTA — every page) (+28 more)

### Community 4 - "Lead Capture Flow"
Cohesion: 0.06
Nodes (35): Complete setup guide with every prompt, document, and resource, Custom Fields, For each form on the website, create a Webhook trigger in GHL:, GHL Help Links:, GHL Help Links:, GHL Help Links:, Go to: AI Agents → Knowledge Base → Create New, Import to GHL: (+27 more)

### Community 5 - "Journal Index"
Cohesion: 0.07
Nodes (22): formatPrice(), metadata, NeighborhoodsPage(), generateMetadata(), NeighborhoodPage(), SERVICE_SLUGS, STATIC, CURATED (+14 more)

### Community 6 - "Calculator and Loans"
Cohesion: 0.18
Nodes (10): BreakdownRow(), ConventionalPage(), CREDIT_SCORE_OPTIONS, DonutLegendRow(), LOAN_TERMS, Occupancy, parseCurrencyInput(), TaxDeductionPage() (+2 more)

### Community 7 - "Global App Shell"
Cohesion: 0.06
Nodes (32): autoprefixer, dependencies, next, react, react-dom, recharts, devDependencies, autoprefixer (+24 more)

### Community 8 - "Core Loan Products"
Cohesion: 0.11
Nodes (18): BlogPage(), categories, categoryLabels, formatDate(), metadata, remainingPosts, sortedPosts, BlogPostPage() (+10 more)

### Community 9 - "Service Page System"
Cohesion: 0.11
Nodes (10): metadata, metadata, metadata, metadata, metadata, metadata, metadata, getServiceBySlug() (+2 more)

### Community 10 - "Navigation and Construction"
Cohesion: 0.07
Nodes (27): graphify-out, mortgage-calculator-suite 2, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx (+19 more)

### Community 11 - "Services Directory"
Cohesion: 0.08
Nodes (25): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+17 more)

### Community 12 - "USDA Product Data"
Cohesion: 0.13
Nodes (18): AmortizationChart, BREAKDOWN_COLORS, BreakdownRow(), CompactCalculator(), CREDIT_SCORE_OPTIONS, DonutLegendRow(), FullCalculator(), LOAN_TERMS (+10 more)

### Community 13 - "Calculator Content"
Cohesion: 0.14
Nodes (17): buildAmortizationSchedule(), calculateMonthlyPi(), BuyNowVsWaitInputs, BuyNowVsWaitOutputs, BuyNowVsWaitScenario, calculateBuyNowVsWait(), calculateDscr(), DscrInputs (+9 more)

### Community 14 - "Motion Utilities"
Cohesion: 0.15
Nodes (13): BreakdownRow(), DonutLegendRow(), LOAN_TERMS, PaymentDonut(), getDownPaymentBand(), getVaFundingFeePercent(), VA_FUNDING_FEE_TABLE, VaDownPaymentBand (+5 more)

### Community 15 - "Jumbo Loans"
Cohesion: 0.20
Nodes (15): calculateMonthlyMiPremium(), getArchMiAnnualRate(), getLoanTermBand(), getLtvBand(), LtvBandKey, mapCreditScoreToTier(), MI_ADJUSTMENTS, MI_BASE_RATES (+7 more)

### Community 16 - "Reverse Mortgages"
Cohesion: 0.19
Nodes (16): calculateConventionalPayment(), calculateMonthlyMiPremium(), getArchMiAnnualRate(), getLoanTermBand(), getLtvBand(), LtvBandKey, mapCreditScoreToTier(), MI_ADJUSTMENTS (+8 more)

### Community 17 - "DSCR Loans"
Cohesion: 0.11
Nodes (17): Agent 1: Inbound Receptionist, Agent 2: Outbound Speed-to-Lead, CONVERSATION AI, Conversation AI + Voice AI Setup, REFERENCE LINKS, Step 1: Enable Conversation AI, Step 2: Connect Your Knowledge Base, Step 3: Connect Your Calendar (+9 more)

### Community 18 - "VA Loans"
Cohesion: 0.11
Nodes (17): AUTO-REFRESH SCHEDULE SUMMARY, CONNECTING KB TO YOUR WEBSITE, Dynamic Content Strategy:, GHL HELP LINKS, GHL Knowledge Base — Complete Strategy, KNOWLEDGE BASE SOURCES (Add all of these), Source 1: DOCX Upload — "Services & Business Info", Source 2: CSV Table — "Product Types" (+9 more)

### Community 19 - "Refinance Loans"
Cohesion: 0.19
Nodes (7): BuyNowVsWaitPage(), ScenarioCard(), TERM_OPTIONS, BuyNowVsWaitInputs, BuyNowVsWaitOutputs, BuyNowVsWaitScenario, calculateBuyNowVsWait()

### Community 20 - "Investment Loans"
Cohesion: 0.21
Nodes (13): AffordabilityPage(), fmt(), fmtFull(), fmtPct(), SCENARIO_META, ScenarioCard(), AffordabilityInputs, AffordabilityOutputs (+5 more)

### Community 21 - "Purchase Loans"
Cohesion: 0.18
Nodes (14): BlendedRateBar(), DEBT_COLORS, DebtConsolidationPage(), DEFAULT_DEBTS, fmt(), fmtFull(), fmtPct(), calculateDebtConsolidation() (+6 more)

### Community 22 - "HELOC Loans"
Cohesion: 0.23
Nodes (15): fmt(), fmtFull(), monthsToLabel(), PaymentStrategyPage(), SavingsBadge(), STRATEGIES, StrategyCard(), StrategyKey (+7 more)

### Community 23 - "FHA Loans"
Cohesion: 0.18
Nodes (12): DEFAULT_RENTS, DtiBar(), fmt(), fmtFull(), fmtPct(), HouseHackingPage(), UNIT_COLORS, UNIT_LABELS_BY_COUNT (+4 more)

### Community 24 - "Service Marquee"
Cohesion: 0.17
Nodes (7): BreakdownRow(), DonutLegendRow(), HOUSEHOLD_SIZES, LOAN_TERMS, PaymentDonut(), UsdaInputs, UsdaOutputs

### Community 25 - "Neighborhood Grid"
Cohesion: 0.18
Nodes (8): VALID, WEBHOOKS, metadata, BookingCalendar(), State, calendarFor(), LEAD_TAGS, LeadFormType

### Community 26 - "Search Crawling"
Cohesion: 0.18
Nodes (11): calculateTotalInterest(), calculateUsdaFees(), UsdaFeeContext, UsdaFeeResult, calculateHouseHacking(), HouseHackingInputs, HouseHackingOutputs, RentalUnit (+3 more)

### Community 27 - "Primary CTA"
Cohesion: 0.16
Nodes (11): CashToClosePage(), DEFAULT_PREPAIDS, PROGRAM_LABELS, PROGRAM_MIN_DOWN, ScenarioCard(), WaterfallRow(), calculateCashToClose(), CashToCloseInputs (+3 more)

### Community 28 - "Featured Neighborhoods"
Cohesion: 0.15
Nodes (9): CltvPage(), DEFAULT_FIRST, DEFAULT_OTHER, DEFAULT_SECOND, calculateCltv(), CltvInputs, CltvOutputs, LienBreakdown (+1 more)

### Community 29 - "Brand Mission"
Cohesion: 0.13
Nodes (8): BreakdownRow(), CREDIT_SCORE_OPTIONS, DonutLegendRow(), LOAN_TERMS, PaymentDonut(), Props, FhaInputs, AmortizationRow

### Community 30 - "Trust Statistics"
Cohesion: 0.13
Nodes (6): metadata, metadata, metadata, exploreLinks, loanLinks, teamLinks

### Community 31 - "rent-vs-buy.ts"
Cohesion: 0.17
Nodes (12): Props, annualInterestForYear(), BRACKETS, calculateRentVsBuy(), getMarginalRate(), MORTGAGE_CAP, RentVsBuyInputs, RentVsBuyOutputs (+4 more)

### Community 32 - "The Lindley Team — First-Touch Agent Prompts (source of truth)"
Cohesion: 0.14
Nodes (13): Deployable AI-Agent prompt, Deployable AI-Agent prompt, Deployable AI-Agent prompt, Deployable AI-Agent prompt, Deployable AI-Agent prompt, Deployable AI-Agent prompt, divorce, first-time-buyer (+5 more)

### Community 33 - "page.tsx"
Cohesion: 0.18
Nodes (7): DOWN_SOURCE_OPTIONS, MoveUpPage(), TERM_OPTIONS, calculateMoveUp(), DownPaymentSource, MoveUpInputs, MoveUpOutputs

### Community 34 - "Nav.tsx"
Cohesion: 0.14
Nodes (5): faqs, metadata, metadata, metadata, GROUPS

### Community 35 - "3. Core reference (the "Services & Business Info" source)"
Cohesion: 0.15
Nodes (12): 1. How to wire it in GHL, 2. Agent goals (recap — full behavior is in the agent prompts), 3. Core reference (the "Services & Business Info" source), 4. Custom Bot Responses (exact answers — locked voice, no em dashes, "complimentary" not "free"), Divorce lending (handle with care), How it goes, Loan programs (plain one-liners; the site pages have the detail), Neighborhoods (+4 more)

### Community 36 - "Reskin checklist — everything that needs to change"
Cohesion: 0.15
Nodes (12): 1. Brand metadata (one file), 2. Primary brand color (one file), 3. Neutral palette (optional, same file), 4. Fonts (same file), 5. Chart & data visualization colors (hardcoded in page files), 6. Global CSS (one file), Architecture (don't touch), File inventory (+4 more)

### Community 37 - "page.tsx"
Cohesion: 0.18
Nodes (5): ComparisonCard(), NEW_TERM_OPTIONS, ClosingCostStrategy, RefinanceInputs, RefinanceOutputs

### Community 38 - "va.ts"
Cohesion: 0.29
Nodes (10): getDownPaymentBand(), getVaFundingFeePercent(), VA_FUNDING_FEE_TABLE, VaDownPaymentBand, VaFundingFeeContext, VaServiceStatus, VaUseCount, calculateVaPayment() (+2 more)

### Community 39 - "The Lindley Team → Movement Mortgage — Copy Rebrand Spec & Change Log"
Cohesion: 0.18
Nodes (10): 1. Evaluation — live WordPress site vs. merge objectives, 2. Positioning (your steer, locked), 3. Voice, 4. People & facts (verified), 5. Compliance / disclosure standard, 6. Change log — what I edited (all in `src/`), 7. Confirmed corrections (applied July 14), 8. GHL wiring — built to spec (paste URLs once, it's live) (+2 more)

### Community 40 - "page.tsx"
Cohesion: 0.19
Nodes (8): PaymentDonut(), InvestmentPropertyPage(), ProFormaRow(), TERM_OPTIONS, calculateInvestmentProperty(), InvestmentPropertyInputs, InvestmentPropertyOutputs, formatCurrency()

### Community 41 - "page.tsx"
Cohesion: 0.16
Nodes (7): DscrPage(), TERM_OPTIONS, calculateDscr(), DscrInputs, DscrOutputs, UsdaFeeContext, UsdaFeeResult

### Community 42 - "fha.ts"
Cohesion: 0.17
Nodes (20): FhaPage(), RefinancePage(), UsdaPage(), VaPage(), buildAmortizationSchedule(), calculateMonthlyPi(), calculateTotalInterest(), calculateConventionalPayment() (+12 more)

### Community 43 - "fha.ts"
Cohesion: 0.33
Nodes (7): FhaInputs, FhaOutputs, calculateFhaMip(), FhaMipContext, FhaMipDuration, FhaMipResult, getAnnualMipRateAndDuration()

### Community 44 - "tax-deduction.ts"
Cohesion: 0.25
Nodes (8): BRACKETS, calculateTaxDeduction(), getMarginalRate(), MORTGAGE_CAP, SALT_CAP, STANDARD_DEDUCTION, TaxDeductionInputs, TaxDeductionOutputs

### Community 45 - "layout.tsx"
Cohesion: 0.25
Nodes (6): fraunces, inter, IntrinsicElements, JSX, metadata, ORG_LD

### Community 46 - "affordability.ts"
Cohesion: 0.39
Nodes (7): AffordabilityInputs, AffordabilityOutputs, AffordabilityScenario, buildScenario(), calculateAffordability(), piRate(), r2()

### Community 47 - "debt-consolidation.ts"
Cohesion: 0.32
Nodes (7): calculateDebtConsolidation(), DebtBreakdown, DebtConsolidationInputs, DebtConsolidationOutputs, DebtItem, estimateRemainingInterest(), interestOverPeriod()

### Community 48 - "payment-strategy.ts"
Cohesion: 0.43
Nodes (7): calculatePaymentStrategy(), computeBaseMonthlyPi(), PaymentStrategyInputs, PaymentStrategyOutputs, r2(), simulate(), StrategyResult

### Community 49 - "1. New Lead Nurture (Fast 5) - Claim Offer"
Cohesion: 0.29
Nodes (6): 1. New Lead Nurture (Fast 5) - Claim Offer, Any questions SMS  (sms), Booking Link SMS  (sms), Conversational Email  (email), Conversational SMS  (sms), Survey Link SMS  (sms)

### Community 50 - "lindley-new-copy-deck.md"
Cohesion: 0.29
Nodes (6): ABOUT, CONTACT, HOME, LANDING — /first-time-buyer, SERVICES, The Lindley Team — Website Copy (final read-through)

### Community 51 - "Mortgage Calculator Suite"
Cohesion: 0.29
Nodes (6): Building New Calculators, Calculators Planned, Mortgage Calculator Suite, Project Structure, Quick Start, Tech Stack

### Community 52 - "Accessibility Review — WCAG 2.1 AA"
Cohesion: 0.33
Nodes (5): Accessibility Review — WCAG 2.1 AA, Fixed today, Flagged for you, Net read, What's already solid

### Community 53 - "2. Appointment Confirmation + Reminders"
Cohesion: 0.33
Nodes (5): 1hr Reminder Email  (email), 1hr Reminder SMS  (sms), 24 hr Reminder Email  (email), 2. Appointment Confirmation + Reminders, Confirmation Email  (email)

### Community 54 - "5. Long-Term Nurture"
Cohesion: 0.33
Nodes (5): 5. Long-Term Nurture, Nurture Email 1  (email), Nurture Email 2  (email), Nurture Email 3  (email), Nurture Email 4  (email)

### Community 55 - "Compliance Archive — MAP Rule / Reg N (12 CFR 1014)"
Cohesion: 0.33
Nodes (5): Annual check (required), Compliance Archive — MAP Rule / Reg N (12 CFR 1014), How it's triggered (the actual process), Not yet covered (add when it goes live), What's archived

### Community 56 - "Compliance Review — thelindleyteam.com"
Cohesion: 0.33
Nodes (5): Compliance Review — thelindleyteam.com, Fixed today (no sign-off needed — these were unambiguous gaps), Flagged for you — judgment calls, not auto-fixed, Net read, What's already solid (confirmed, not just assumed)

### Community 57 - "The Lindley Team — Conversation AI (chat/SMS) + Voice AI (source of truth)"
Cohesion: 0.33
Nodes (5): Chat AI, Deployable system prompt, Deployable system prompt, The Lindley Team — Conversation AI (chat/SMS) + Voice AI (source of truth), Voice AI

### Community 59 - "cash-to-close.ts"
Cohesion: 0.33
Nodes (4): CashToCloseInputs, CashToCloseOutputs, FeeItem, LoanProgram

### Community 60 - "cltv.ts"
Cohesion: 0.33
Nodes (4): CltvInputs, CltvOutputs, LienBreakdown, LienInput

### Community 61 - "3. Appt No Show"
Cohesion: 0.40
Nodes (4): 3. Appt No Show, Reschedule Follow Up Link  (email), SMS  (sms), SMS  (sms)

### Community 62 - "INDEX.md"
Cohesion: 0.40
Nodes (3): 4. New Sale - Send Review Request, Internal Notification  (internal_notification), Compliance snapshot — 2026-07-14

### Community 63 - "wh-apply-click"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-apply-click

### Community 64 - "wh-appointment-booked"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-appointment-booked

### Community 65 - "wh-calculator"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-calculator

### Community 66 - "wh-divorce-consult"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-divorce-consult

### Community 67 - "wh-first-time-buyer"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-first-time-buyer

### Community 68 - "wh-guide-download"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-guide-download

### Community 69 - "wh-neighborhood"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-neighborhood

### Community 70 - "wh-rate-quote"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-rate-quote

### Community 71 - "wh-schedule-call"
Cohesion: 0.40
Nodes (4): Notify team (app)  (internal_notification), Notify team (email)  (internal_notification), Notify team (text)  (internal_notification), wh-schedule-call

### Community 72 - "compliance-export.py"
Cohesion: 0.60
Nodes (4): body_of(), list_workflows(), main(), The ghl CLI wrapper lists workflows (public API); internal API has no list.

### Community 73 - "move-up.ts"
Cohesion: 0.40
Nodes (4): calculateMoveUp(), DownPaymentSource, MoveUpInputs, MoveUpOutputs

### Community 74 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 76 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 100 - "June's Knowledge Base — operational pack"
Cohesion: 0.22
Nodes (8): 1. The online application (June's #1 conversion action after booking), 2. Troubleshooting (what June can and can't touch), 3. Scheduling matrix (which calendar, for whom), 4. Handoff boundaries — what June answers vs. routes, 5. Lead capture (what June always tries to get), How to wire it in GHL, June's Knowledge Base — operational pack, Reminder: attach, don't rebuild

### Community 101 - "June — Voice Agent-1 (GHL Voice AI) — deployable config"
Cohesion: 0.40
Nodes (4): June — Voice Agent-1 (GHL Voice AI) — deployable config, System prompt (paste into Voice Agent-1), What changed from the phone Voice AI prompt (`chat-voice-agents.md`), Where this goes in GHL

## Knowledge Gaps
- **503 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `SCENARIO_META`, `TERM_OPTIONS`, `PROGRAM_MIN_DOWN` (+498 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buildAmortizationSchedule()` connect `Calculator Content` to `Search Crawling`, `fha.ts`, `USDA Product Data`, `rent-vs-buy.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `formatCurrency()` connect `page.tsx` to `page.tsx`, `Core Conversion Pages`, `page.tsx`, `Calculator and Loans`, `page.tsx`, `fha.ts`, `Motion Utilities`, `Refinance Loans`, `Service Marquee`, `Primary CTA`, `Featured Neighborhoods`, `Brand Mission`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `calculateMonthlyPi()` connect `Calculator Content` to `va.ts`, `move-up.ts`, `fha.ts`, `debt-consolidation.ts`, `Reverse Mortgages`, `Search Crawling`, `rent-vs-buy.ts`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `SCENARIO_META` to the rest of the system?**
  _503 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Neighborhood Experience` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Core Conversion Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.0641025641025641 - nodes in this community are weakly interconnected._
- **Should `Homepage Experience` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._