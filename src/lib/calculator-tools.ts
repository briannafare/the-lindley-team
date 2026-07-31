// ── Calculator tools ─────────────────────────────────────────────────────────
// Standalone tools that don't map to a loan product, so they live under
// /calculators/* rather than /services/*. Loan-product calculators (FHA, VA,
// DSCR, USDA, conventional, refinance, investment) are embedded in their
// service page instead, via ServicePageLayout's `calculator` slot.
//
// The hub page, the individual pages, and the sitemap all read from this list —
// add a tool here and it appears in all three.

export type CalculatorTool = {
  slug: string;
  /** <h1> and hub card title */
  name: string;
  /** Short label for the hub card grid */
  short: string;
  metaTitle: string;
  /** Meta description — entity-dense and answer-shaped, so it reads like a claim. */
  metaDescription: string;
  /** Lead paragraph under the h1 */
  intro: string;
  /** The question this tool answers, in the user's words — used for FAQ schema. */
  question: string;
  /** A direct, quotable answer. */
  answer: string;
  related?: { label: string; href: string }[];
};

export const CALCULATOR_TOOLS: CalculatorTool[] = [
  {
    slug: "affordability",
    name: "How Much House Can I Afford?",
    short: "Affordability",
    metaTitle: "How Much House Can I Afford? Portland Affordability Calculator",
    metaDescription:
      "Work out how much house you can afford in Portland, Oregon from your income, debts, and available cash. Three scenarios — conservative, moderate, and stretch — with the debt-to-income math shown.",
    intro:
      "Based on your income, debts, and available cash — three scenarios and one honest recommendation, with the debt-to-income math shown rather than hidden.",
    question: "How much house can I afford in Portland?",
    answer:
      "Affordability is set by your debt-to-income ratio, your down payment, and the current rate — not by a rule of thumb. Most lenders cap total monthly debt around 43-50% of gross income, so your existing car and student loan payments reduce what you can borrow. This calculator runs conservative, moderate, and stretch scenarios from your actual numbers.",
    related: [
      { label: "Home purchase loans", href: "/services/purchase" },
      { label: "First-time buyers", href: "/first-time-buyer" },
    ],
  },
  {
    slug: "rent-vs-buy",
    name: "Rent vs Buy Calculator",
    short: "Rent vs buy",
    metaTitle: "Rent vs Buy Calculator — Portland, Oregon | The Lindley Team",
    metaDescription:
      "Compare renting against buying in Portland over time: equity, appreciation, closing costs, maintenance, and the tax picture — including whether you would actually clear the standard deduction.",
    intro:
      "Compares renting against buying over the years you plan to stay — equity, appreciation, closing costs, maintenance, and the real tax picture, including whether itemizing would beat the standard deduction at all.",
    question: "Is it better to rent or buy in Portland?",
    answer:
      "It depends mostly on how long you stay. Buying carries large up-front costs, so a short stay usually favours renting even in a rising market. This calculator finds your break-even year. It also only counts mortgage interest as a tax saving where itemized deductions actually exceed the standard deduction — many buyers see no tax benefit at all.",
    related: [
      { label: "Home purchase loans", href: "/services/purchase" },
      { label: "First-time buyers", href: "/first-time-buyer" },
    ],
  },
  {
    slug: "house-hacking",
    name: "House Hacking & Multi-Unit Affordability",
    short: "House hacking",
    metaTitle: "House Hacking Calculator — Portland Duplex & Multi-Unit | The Lindley Team",
    metaDescription:
      "Buy a 2-4 unit property in Portland, live in one unit, and let rent cover the mortgage. Models owner-occupied multi-unit financing, rental income offset, and your true out-of-pocket payment.",
    intro:
      "Buy a 2-4 unit property, live in one unit, and let the tenants cover most of the mortgage. Models owner-occupied multi-unit financing and what you would actually pay each month after rent.",
    question: "Can I buy a duplex in Portland and rent out the other unit?",
    answer:
      "Yes — a 2-4 unit property you live in qualifies for owner-occupied financing, which means far lower down payments than an investment loan, and lenders will usually count a portion of the projected rent as income. That combination is why house hacking is often the cheapest way into Portland real estate.",
    related: [
      { label: "Investment property loans", href: "/services/investment" },
      { label: "Home purchase loans", href: "/services/purchase" },
    ],
  },
  {
    slug: "cash-to-close",
    name: "Cash to Close Calculator",
    short: "Cash to close",
    metaTitle: "Cash to Close Calculator — What You Bring to Closing | The Lindley Team",
    metaDescription:
      "Estimate the total cash you need at closing on an Oregon or Washington home: down payment, closing costs, prepaid taxes and insurance, escrow reserves, minus credits and earnest money.",
    intro:
      "The number people underestimate most. Down payment, closing costs, prepaids, and escrow reserves — minus your earnest money and any seller or lender credits.",
    question: "How much cash do I need to close on a house?",
    answer:
      "Cash to close is more than the down payment. It also includes closing costs, prepaid property taxes and homeowners insurance, and escrow reserves, reduced by earnest money already paid and any seller or lender credits. On a typical Portland purchase the total runs well above the down payment alone.",
    related: [
      { label: "Home purchase loans", href: "/services/purchase" },
      { label: "Down payment assistance", href: "/services/down-payment-assistance" },
    ],
  },
  {
    slug: "cltv",
    name: "CLTV & Blended Rate Calculator",
    short: "CLTV & blended rate",
    metaTitle: "CLTV & Blended Rate Calculator — Combined Loan-to-Value | The Lindley Team",
    metaDescription:
      "Calculate combined loan-to-value across a first mortgage and a HELOC or second lien, and the blended interest rate across both — the figures lenders underwrite to.",
    intro:
      "Combined loan-to-value across a first mortgage and any second lien or HELOC, plus the blended rate across both — the numbers a lender actually underwrites to.",
    question: "What is CLTV and why does it matter?",
    answer:
      "CLTV is combined loan-to-value: every loan secured by the property divided by its value. A first mortgage plus a HELOC are underwritten together, so CLTV — not the first mortgage alone — governs whether you qualify and at what price. Most programs cap CLTV around 80-90%.",
    related: [
      { label: "HELOC", href: "/services/heloc" },
      { label: "Cash-out refinance", href: "/services/cash-out" },
    ],
  },
  {
    slug: "debt-consolidation",
    name: "Debt Consolidation & Blended Rate Refi",
    short: "Debt consolidation",
    metaTitle: "Debt Consolidation Refinance Calculator — Blended Rate | The Lindley Team",
    metaDescription:
      "Roll high-rate credit cards and loans into a cash-out refinance and see the true comparison: blended rate, monthly savings, and the lifetime interest cost of re-amortizing over 30 years.",
    intro:
      "Roll high-rate debts into a cash-out refinance and see the honest comparison — including the part most calculators skip: what stretching short-term debt over 30 years costs in total interest.",
    question: "Should I consolidate debt into my mortgage?",
    answer:
      "It lowers your monthly payment when your mortgage rate is well below your card and loan rates. The catch is term: moving a 5-year debt onto a 30-year mortgage can cost more in total interest even at a lower rate, and it converts unsecured debt into debt secured by your home. This calculator shows both the monthly and the lifetime figure.",
    related: [
      { label: "Cash-out refinance", href: "/services/cash-out" },
      { label: "Refinance", href: "/services/refinance" },
    ],
  },
  {
    slug: "tax-deduction",
    name: "Mortgage Tax Deduction Estimator",
    short: "Tax deduction",
    metaTitle: "Mortgage Interest Tax Deduction Estimator | The Lindley Team",
    metaDescription:
      "Estimate your federal tax saving from mortgage interest and property tax, against the standard deduction, the $750k mortgage cap, and the $10k SALT cap.",
    intro:
      "Estimates the federal tax saving from mortgage interest and property tax — measured against the standard deduction, the mortgage interest cap, and the SALT cap, so the number is one you can rely on.",
    question: "Is mortgage interest still tax deductible?",
    answer:
      "Yes, but far fewer people benefit than assume they do. Interest is deductible on up to $750,000 of mortgage debt and property tax falls under the $10,000 SALT cap — and you only gain if those combined itemized deductions exceed the standard deduction ($14,600 single / $29,200 married filing jointly for 2024). Below that you take the standard deduction and the mortgage saves you nothing at tax time.",
    related: [
      { label: "Home purchase loans", href: "/services/purchase" },
      { label: "Refinance", href: "/services/refinance" },
    ],
  },
  {
    slug: "move-up",
    name: "Move-Up Buyer Calculator",
    short: "Move-up buyer",
    metaTitle: "Move-Up Buyer Calculator — Sell and Buy in Portland | The Lindley Team",
    metaDescription:
      "Selling one Portland home and buying the next: net proceeds after costs and payoff, the new payment, and what giving up a low locked-in rate really costs.",
    intro:
      "Selling one home and buying the next. Net proceeds after selling costs and loan payoff, the new payment, and an honest read on what giving up a low locked-in rate costs you.",
    question: "Should I sell my house and buy a bigger one?",
    answer:
      "The deciding factor is usually the rate you would give up. Trading a 3% mortgage for a current-market rate can raise your payment sharply even when you have substantial equity. This calculator shows net proceeds after selling costs and payoff, the new payment, and the cost of losing the old rate.",
    related: [
      { label: "Home purchase loans", href: "/services/purchase" },
      { label: "Jumbo loans", href: "/services/jumbo" },
    ],
  },
  {
    slug: "buy-now-vs-wait",
    name: "Buy Now vs Wait Calculator",
    short: "Buy now vs wait",
    metaTitle: "Buy Now or Wait? Portland Home Price & Rate Calculator | The Lindley Team",
    metaDescription:
      "Model buying a Portland home now against waiting: price appreciation versus rate changes, extra rent paid while waiting, and the down payment you would save.",
    intro:
      "Waiting is a bet on two moving numbers at once — price and rate. This models both against the rent you keep paying and the extra down payment you would save.",
    question: "Should I buy a house now or wait for rates to drop?",
    answer:
      "Waiting only wins if prices and rates move enough to offset the rent you pay meanwhile. A lower rate later on a higher price can leave you worse off, and you can refinance a rate but you cannot renegotiate a purchase price. This calculator prices both paths side by side.",
    related: [
      { label: "Home purchase loans", href: "/services/purchase" },
      { label: "First-time buyers", href: "/first-time-buyer" },
    ],
  },
  {
    slug: "payment-strategy",
    name: "Payment Strategy Optimizer",
    short: "Payoff strategy",
    metaTitle: "Mortgage Payoff Strategy Calculator — Extra Payments | The Lindley Team",
    metaDescription:
      "Compare mortgage payoff strategies side by side: extra monthly payments, bi-weekly payments, one extra payment a year, and lump sums — with interest saved and time cut from the loan.",
    intro:
      "Compares payoff strategies side by side — extra monthly, bi-weekly, one extra payment a year, a lump sum — and shows the interest saved and the years cut off the loan.",
    question: "Do bi-weekly mortgage payments actually save money?",
    answer:
      "Yes, but only because of what they add up to. Paying half your payment every two weeks means 26 half-payments a year, which is 13 full payments instead of 12. The saving comes from that one extra payment, not from the schedule itself — so a single extra payment a year does the same thing.",
    related: [
      { label: "Refinance", href: "/services/refinance" },
      { label: "Home purchase loans", href: "/services/purchase" },
    ],
  },
];

export function getToolBySlug(slug: string): CalculatorTool | undefined {
  return CALCULATOR_TOOLS.find((t) => t.slug === slug);
}
