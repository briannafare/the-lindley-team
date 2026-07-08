export interface ServiceData {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string; // SVG shape type
  tag?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    aeoQuestion: string;
  };
  heroImage: string;
  whoFor: string[];
  requirements: {
    label: string;
    value: string;
  }[];
  pros: string[];
  cons: string[];
  process: {
    step: string;
    title: string;
    desc: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const services: ServiceData[] = [
  {
    slug: "purchase",
    name: "Purchase Loans",
    shortName: "Purchase",
    tagline: "Your first home, your forever home, or your next investment — structured around your goals, not the rate sheet.",
    description: "A purchase loan is the mortgage you use to buy a home. The Lindley Team at Movement Mortgage helps you find the right loan structure for your income, credit profile, down payment, and long-term financial goals. Whether you're a first-time buyer in Portland's Sellwood neighborhood or upgrading to a larger home in Lake Oswego, the purchase process starts with understanding where you are financially and where you want to go.",
    icon: "circle",
    tag: "Most Popular",
    seo: {
      title: "Portland Purchase Mortgage Loans | The Lindley Team",
      description: "Get pre-approved for a Portland home purchase with The Lindley Team at Movement Mortgage. Licensed in OR & WA. NMLS #1367416 / #265974.",
      keywords: ["Portland mortgage", "Oregon home loan", "Portland home purchase", "first time home buyer Portland", "mortgage lender Portland OR"],
      aeoQuestion: "How do I get a mortgage to buy a home in Portland Oregon?",
    },
    heroImage: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
    whoFor: [
      "First-time home buyers entering the Portland market",
      "Move-up buyers upgrading to a larger home",
      "Relocating professionals moving to Oregon or Washington",
      "Real estate investors purchasing rental properties",
      "Buyers with non-traditional income (self-employed, 1099, commission-based)",
    ],
    requirements: [
      { label: "Credit Score", value: "580+ (FHA) or 620+ (Conventional)" },
      { label: "Down Payment", value: "As low as 0% (VA) or 3% (Conventional)" },
      { label: "DTI Ratio", value: "Typically under 45-50%" },
      { label: "Employment", value: "2 years history preferred" },
      { label: "Documentation", value: "Pay stubs, W2s/tax returns, bank statements" },
    ],
    pros: [
      "Build equity instead of paying rent",
      "Lock in fixed housing costs with a fixed-rate mortgage",
      "Tax benefits including mortgage interest deduction",
      "Access to a full range of loan programs through Movement Mortgage — matched to your situation",
      "Personalized strategy from an experienced Portland lender",
    ],
    cons: [
      "Requires upfront costs (down payment, closing costs)",
      "Market fluctuations can affect short-term home value",
      "Maintenance and property taxes are your responsibility",
      "Less flexibility than renting if your plans change quickly",
    ],
    process: [
      { step: "01", title: "Discovery Call", desc: "30-minute conversation about your goals, timeline, budget, and financial picture. No commitment, no pressure." },
      { step: "02", title: "Pre-Approval", desc: "We pull credit, verify income, and lock in a pre-approval letter that shows sellers you're serious. This takes 24-48 hours." },
      { step: "03", title: "Loan Selection", desc: "Once you're under contract, we compare products from our lender network and recommend the structure that best fits your goals." },
      { step: "04", title: "Close & Keys", desc: "We manage the paperwork, coordinate with your agent and title company, and get you to the closing table on time." },
    ],
    faqs: [
      { q: "How much do I need for a down payment in Portland?", a: "Down payment requirements range from 0% (VA loans) to 3% (Conventional) to 3.5% (FHA). While 20% avoids private mortgage insurance (PMI), most Portland buyers put down far less. Oregon also has down payment assistance programs like OHCS that can help cover your upfront costs. We'll walk you through all your options." },
      { q: "How long does the mortgage process take?", a: "From pre-approval to closing, the typical timeline is 30-45 days. Pre-approval itself takes 24-48 hours. The biggest variable is finding the right home — once you're under contract, we move fast." },
      { q: "What credit score do I need to buy a home?", a: "The minimum depends on the loan type: 580 for FHA, 620 for most Conventional loans, and no minimum for VA (though most lenders look for 580+). If your score is below these thresholds, we can discuss strategies to improve it before applying." },
      { q: "Should I get pre-approved before house hunting?", a: "Absolutely. In Portland's market, sellers expect buyers to have pre-approval letters. Without one, most listing agents won't take your offer seriously. Pre-approval also tells YOU what you can afford so you're not wasting time looking at homes outside your range." },
      { q: "What's the difference between a mortgage broker and a bank?", a: "Banks can only offer their own products. Working through Movement Mortgage, The Lindley Team has access to a wide range of loan programs and finds the right fit for your situation rather than pushing a single product shelf." },
      { q: "How much house can I afford in Portland?", a: "This depends on your income, debts, down payment, and the current interest rate. A general rule: your total monthly housing payment (mortgage + taxes + insurance) shouldn't exceed about 28-31% of your gross monthly income. Our calculator can give you a more specific number." },
      { q: "What are closing costs and how much should I expect?", a: "Closing costs typically run 2-5% of the home's purchase price. In Portland, on a $500,000 home, that's $10,000-$25,000. These include lender fees, title insurance, appraisal, prepaid taxes and insurance. We can sometimes negotiate seller credits to offset these." },
      { q: "Can I buy a home if I'm self-employed?", a: "Yes. Self-employed borrowers need 2 years of tax returns instead of W2s, and we use your net income (not gross). It can be trickier, but we work with self-employed buyers regularly and know which lenders are most flexible with non-traditional income." },
    ],
  },
  {
    slug: "refinance",
    name: "Refinance",
    shortName: "Refinance",
    tagline: "Lower your rate, shorten your term, or restructure your debt — but only when the math actually makes sense.",
    description: "Refinancing replaces your current mortgage with a new one, ideally on better terms. The most common reasons: locking in a lower interest rate, switching from an adjustable-rate to a fixed-rate mortgage, shortening your loan term (e.g., 30-year to 15-year), or removing PMI once you've built 20% equity. But refinancing isn't always the right move — it comes with closing costs that need to be weighed against your savings. That's where we come in. We'll run the numbers honestly and tell you whether refinancing makes financial sense for your specific situation, even if the answer is 'not right now.'",
    icon: "square",
    seo: {
      title: "Portland Mortgage Refinance | The Lindley Team",
      description: "Should you refinance your Portland mortgage? We'll run the numbers and tell you honestly. Access to hundreds of refinance products. NMLS #1367416.",
      keywords: ["Portland refinance", "Oregon mortgage refinance", "refinance rates Portland", "should I refinance my mortgage", "Portland refi"],
      aeoQuestion: "When should I refinance my mortgage in Oregon?",
    },
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    whoFor: [
      "Homeowners with rates above current market rates",
      "Borrowers looking to drop PMI after gaining equity",
      "Homeowners wanting to switch from ARM to fixed-rate",
      "Those looking to shorten their loan term and save on interest",
      "Homeowners who want to consolidate debt at a lower rate",
    ],
    requirements: [
      { label: "Credit Score", value: "620+ (Conventional), 580+ (FHA Streamline)" },
      { label: "Equity", value: "Typically 5-20% depending on program" },
      { label: "DTI Ratio", value: "Under 50% in most cases" },
      { label: "Seasoning", value: "6-12 months since last refinance" },
      { label: "Documentation", value: "Pay stubs, W2s/tax returns, current mortgage statement" },
    ],
    pros: [
      "Lower monthly payment frees up cash flow",
      "Shorter term saves tens of thousands in interest over the life of the loan",
      "Fixed rate eliminates uncertainty of ARM adjustments",
      "Remove PMI once you've built sufficient equity",
      "Consolidate high-interest debt into a lower mortgage rate",
    ],
    cons: [
      "Closing costs typically 2-3% of loan amount",
      "Resets your amortization schedule if you extend the term",
      "Takes time to recoup costs (break-even analysis is critical)",
      "May not make sense if you plan to sell within 2-3 years",
    ],
    process: [
      { step: "01", title: "Break-Even Analysis", desc: "Before anything else, we calculate exactly how long it will take for your monthly savings to cover the closing costs. If the math doesn't work, we tell you." },
      { step: "02", title: "Rate Lock & Application", desc: "Once we confirm it makes sense, we lock your rate and start the application. We compare programs through Movement Mortgage to find the best terms for your situation." },
      { step: "03", title: "Appraisal & Underwriting", desc: "Your home gets appraised to confirm current value. Underwriting reviews your financial profile. We manage both processes." },
      { step: "04", title: "Close & Savings Begin", desc: "You sign the new loan docs, and your new (lower) payment starts the following month. Total timeline: 3-5 weeks." },
    ],
    faqs: [
      { q: "When does refinancing make sense?", a: "The old rule of thumb was 'refinance if rates drop 1%+' but the real answer depends on your break-even point. If you can recoup closing costs within 2-3 years through lower payments, it's usually worth it. If you're planning to sell before the break-even point, it's probably not." },
      { q: "How much does it cost to refinance in Oregon?", a: "Closing costs for a refinance typically run 2-3% of the loan amount. On a $400,000 loan, that's $8,000-$12,000. Some of these costs can be rolled into the new loan, and we can sometimes find lender credits to offset them." },
      { q: "Can I refinance with bad credit?", a: "FHA Streamline refinances have more flexible credit requirements (580+) and don't always require a new appraisal. Conventional refinances typically need 620+. If your credit has dropped, we can discuss options or strategies to improve it first." },
      { q: "How long does a refinance take?", a: "Typically 3-5 weeks from application to closing. FHA Streamline refinances can be faster since they require less documentation." },
      { q: "Should I refinance to a 15-year mortgage?", a: "A 15-year mortgage saves a huge amount in total interest, but your monthly payment will be higher. We'll show you both scenarios side-by-side so you can see the tradeoff between monthly cash flow and long-term savings." },
      { q: "What is an FHA Streamline refinance?", a: "If you currently have an FHA loan, an FHA Streamline lets you refinance with minimal documentation, no appraisal in many cases, and reduced closing costs. It's one of the fastest and cheapest ways to lower your rate." },
      { q: "Can I refinance if I'm underwater on my mortgage?", a: "It's harder but not impossible. Some programs allow refinancing up to 97% LTV (loan-to-value). If you owe more than your home is worth, let's talk about your specific situation — there may be options." },
      { q: "What's the difference between rate-and-term and cash-out refinance?", a: "Rate-and-term refinance changes your rate and/or loan term without taking cash out. Cash-out refinance lets you borrow more than you owe and take the difference as cash. They have different rates, requirements, and purposes. We cover cash-out refinancing on a separate page." },
    ],
  },
  {
    slug: "divorce-lending",
    name: "Divorce Lending",
    shortName: "Divorce Lending",
    tagline: "CDLP-certified mortgage planning that protects both parties and gives you a clear path to your next chapter.",
    description: "Divorce changes everything about your financial picture — including your mortgage. Who keeps the house? Can one spouse qualify alone? How does an equity buyout work? What happens to your credit? These questions need answers before the divorce decree is finalized, not after. As a Certified Divorce Lending Professional (CDLP), Bri Lindley works alongside divorce attorneys, mediators, and financial planners to ensure mortgage-related decisions are made with full information. This isn't about selling you a loan — it's about making sure the settlement agreement is financially realistic and that both parties can actually execute the plan.",
    icon: "triangle",
    tag: "Specialist",
    seo: {
      title: "Divorce Mortgage Specialist Portland | CDLP | The Lindley Team",
      description: "Certified Divorce Lending Professional in Portland OR. Equity buyouts, refinancing during divorce, qualification analysis. Protect your home and your future.",
      keywords: ["divorce mortgage Portland", "CDLP Portland Oregon", "divorce lending specialist", "equity buyout mortgage", "divorce refinance Oregon"],
      aeoQuestion: "How does a divorce affect my mortgage in Oregon?",
    },
    heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    whoFor: [
      "Spouses going through divorce who want to keep the marital home",
      "Divorcing couples who need to understand equity buyout options",
      "Divorce attorneys who need mortgage analysis for settlement negotiations",
      "Mediators who want realistic financial scenarios for both parties",
      "Recently divorced individuals ready to purchase a new home",
    ],
    requirements: [
      { label: "Timing", value: "Can begin analysis before divorce is finalized" },
      { label: "Credit", value: "Varies by program — we assess both parties" },
      { label: "Income", value: "Must qualify on individual income post-divorce" },
      { label: "Documentation", value: "Divorce decree (or draft), financial disclosures, pay stubs, tax returns" },
      { label: "Equity", value: "Home appraisal needed for buyout calculations" },
    ],
    pros: [
      "CDLP certification means specialized knowledge most lenders don't have",
      "Prevents costly mistakes in settlement agreements",
      "Analyzes whether keeping the home is financially viable before you commit",
      "Works directly with your attorney and mediator",
      "Confidential, judgment-free process",
    ],
    cons: [
      "Qualifying on a single income is harder — realistic expectations are important",
      "Equity buyouts require refinancing, which has closing costs",
      "Emotional attachment to the home can cloud financial judgment (we'll be honest)",
      "Timeline depends on divorce proceedings, which can be unpredictable",
    ],
    process: [
      { step: "01", title: "Confidential Consultation", desc: "We start with a private conversation about your situation. No judgment, no pressure. We need to understand the full financial picture before making any recommendations." },
      { step: "02", title: "Mortgage Analysis", desc: "We analyze both parties' ability to qualify independently. This includes income, credit, debts, and equity position. We produce a Real Property Detail Report for your attorney." },
      { step: "03", title: "Settlement Support", desc: "We work with your legal team to ensure the mortgage-related terms of the settlement are realistic and executable. This prevents agreements that look good on paper but can't actually be funded." },
      { step: "04", title: "Execution", desc: "Once the divorce is finalized, we execute the mortgage plan — whether that's an equity buyout refinance, a new purchase, or both." },
    ],
    faqs: [
      { q: "What is a CDLP and why does it matter?", a: "A Certified Divorce Lending Professional (CDLP) has specialized training in the intersection of mortgage lending and divorce proceedings. Most loan officers don't understand how divorce settlements, alimony, child support, and property division affect mortgage qualification. A CDLP does — and can prevent costly mistakes that a regular lender would miss." },
      { q: "Can I keep the house in a divorce?", a: "Possibly — but it depends on whether you can qualify for the mortgage on your own income, afford the equity buyout payment to your spouse, and handle the ongoing costs of homeownership solo. We'll run the numbers honestly and tell you whether it's realistic." },
      { q: "How does an equity buyout work?", a: "In an equity buyout, one spouse refinances the mortgage into their name only and pays the other spouse their share of the equity. For example, if the home is worth $600,000 with a $300,000 mortgage, there's $300,000 in equity. Each spouse's share is $150,000. The keeping spouse would refinance for $450,000 ($300,000 existing mortgage + $150,000 buyout)." },
      { q: "Should I talk to a CDLP before or after my divorce is finalized?", a: "Before — ideally during the settlement negotiation phase. Too many people finalize divorce agreements with mortgage terms that can't actually be executed. Getting a CDLP involved early ensures the settlement is financially realistic." },
      { q: "Will divorce hurt my credit score?", a: "Divorce itself doesn't affect credit, but the financial disruption often does. Late payments on joint accounts, increased debt-to-income ratios, and closing joint accounts can all impact scores. We can help you understand the credit implications and plan accordingly." },
      { q: "Can I use alimony or child support as income to qualify?", a: "Yes, in most cases — if you can document that you'll receive it for at least 3 more years and that it's been consistently paid. We know exactly how different lenders treat these income sources." },
      { q: "What if my spouse won't cooperate with the refinance?", a: "The divorce decree can compel cooperation, but timing and logistics matter. We work with your attorney to ensure the decree includes specific, actionable mortgage language that protects you." },
      { q: "How long after divorce can I buy a new home?", a: "You can start the process immediately after the divorce is finalized. In some cases, we can even begin pre-approval during the divorce if the terms are clear enough. The key is having a finalized decree that shows your income, debts, and obligations clearly." },
    ],
  },
  {
    slug: "fha",
    name: "FHA Loans",
    shortName: "FHA",
    tagline: "Lower down payments, flexible credit requirements — the government-backed program that gets first-time buyers through the door.",
    description: "FHA loans are mortgages insured by the Federal Housing Administration, designed to make homeownership accessible to buyers who might not qualify for conventional financing. With down payments as low as 3.5% and credit score requirements starting at 580, FHA loans are one of the most popular programs for first-time home buyers in the Portland metro area.",
    icon: "star",
    seo: {
      title: "FHA Loans Portland Oregon | Low Down Payment | The Lindley Team",
      description: "FHA loans in Portland with 3.5% down and flexible credit requirements. Expert guidance for first-time buyers in Oregon and Washington. NMLS #1367416.",
      keywords: ["FHA loan Portland", "FHA mortgage Oregon", "first time buyer FHA Portland", "FHA requirements Oregon", "low down payment mortgage Portland"],
      aeoQuestion: "What are the FHA loan requirements in Oregon?",
    },
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    whoFor: [
      "First-time home buyers with limited savings",
      "Buyers with credit scores in the 580-680 range",
      "Borrowers recovering from past credit events",
      "Buyers who want to put less than 5% down",
    ],
    requirements: [
      { label: "Credit Score", value: "580+ for 3.5% down; 500-579 for 10% down" },
      { label: "Down Payment", value: "3.5% minimum" },
      { label: "DTI Ratio", value: "Up to 57% with compensating factors" },
      { label: "MIP", value: "Upfront (1.75%) + Annual (0.55%)" },
      { label: "Property", value: "Must be primary residence; FHA appraisal required" },
    ],
    pros: ["Low 3.5% down payment", "Credit scores as low as 580", "Seller can contribute up to 6% toward closing costs", "Assumable by future buyers"],
    cons: ["Mortgage Insurance Premium (MIP) for life of loan on most terms", "Property must meet FHA condition standards", "Loan limits apply ($517,500 in Portland metro 2024)", "Primary residence only — no investment properties"],
    process: [
      { step: "01", title: "Discovery Call", desc: "We review your credit, income, and savings to confirm FHA is the right fit vs. other low-down-payment options." },
      { step: "02", title: "Pre-Approval", desc: "Full pre-approval with FHA-specific underwriting. You'll have a letter ready for offers." },
      { step: "03", title: "FHA Appraisal", desc: "FHA appraisals are slightly stricter than conventional — we prep you for what inspectors look for." },
      { step: "04", title: "Close & Move In", desc: "We handle the FHA-specific paperwork and get you to the closing table." },
    ],
    faqs: [
      { q: "What credit score do I need for an FHA loan in Oregon?", a: "580 or higher for the standard 3.5% down payment. Scores between 500-579 can qualify with 10% down. Below 500 is not eligible for FHA." },
      { q: "How much is the FHA down payment?", a: "The minimum is 3.5% of the purchase price. On a $400,000 Portland home, that's $14,000. This can come from savings, gifts from family, or Oregon down payment assistance programs." },
      { q: "What is FHA mortgage insurance (MIP)?", a: "FHA charges an upfront MIP of 1.75% of the loan amount (rolled into the loan) plus an annual MIP of 0.55% paid monthly. On most FHA loans, MIP lasts the life of the loan unless you refinance to conventional." },
      { q: "Can I use an FHA loan for a condo in Portland?", a: "Yes, but the condo complex must be on the FHA-approved list. Not all Portland condos qualify. We can check eligibility before you make an offer." },
      { q: "What are FHA loan limits in Portland?", a: "FHA loan limits vary by county and are updated annually. We'll confirm the current limit for your target area during our initial conversation." },
      { q: "Can I buy a fixer-upper with an FHA loan?", a: "The standard FHA 203(b) loan requires the home to meet minimum condition standards. For fixer-uppers, the FHA 203(k) renovation loan lets you finance both the purchase and renovations in one mortgage." },
    ],
  },
  {
    slug: "va",
    name: "VA Loans",
    shortName: "VA Loans",
    tagline: "Zero down, no PMI, competitive rates — the benefit you earned, used right.",
    description: "VA loans are mortgage loans guaranteed by the U.S. Department of Veterans Affairs, available to active-duty service members, veterans, and eligible surviving spouses. They're arguably the best mortgage product available — zero down payment, no private mortgage insurance, competitive interest rates, and flexible qualification standards. If you've served, this is a benefit you've earned and we'll make sure you use it to its full advantage.",
    icon: "concentric",
    seo: {
      title: "VA Loans Portland Oregon | Zero Down | The Lindley Team",
      description: "VA home loans in Portland with zero down payment and no PMI. Expert guidance for veterans and active-duty service members. Licensed in OR/WA.",
      keywords: ["VA loan Portland", "VA mortgage Oregon", "veteran home loan Portland", "zero down mortgage Oregon", "VA loan requirements"],
      aeoQuestion: "How do VA loans work in Oregon?",
    },
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    whoFor: ["Active-duty military", "Veterans with eligible discharge", "National Guard and Reserve members", "Eligible surviving spouses"],
    requirements: [
      { label: "Eligibility", value: "Certificate of Eligibility (COE) from VA" },
      { label: "Down Payment", value: "0% — zero down" },
      { label: "Credit Score", value: "No VA minimum (most lenders: 580-620)" },
      { label: "Funding Fee", value: "1.25-3.3% (waived for disabled vets)" },
      { label: "Occupancy", value: "Primary residence only" },
    ],
    pros: ["Zero down payment", "No PMI ever", "Competitive rates below conventional", "No prepayment penalty", "Assumable by eligible buyers"],
    cons: ["Funding fee (1.25-3.3%) unless exempt", "Primary residence only", "VA appraisal required with specific property standards", "Not all lenders have VA experience"],
    process: [
      { step: "01", title: "Eligibility Check", desc: "We help you obtain your Certificate of Eligibility (COE) and confirm your entitlement." },
      { step: "02", title: "Pre-Approval", desc: "VA-specific pre-approval with zero-down scenario analysis." },
      { step: "03", title: "VA Appraisal", desc: "VA appraisals have specific requirements — we know what to expect." },
      { step: "04", title: "Close", desc: "Zero down, no PMI. Your monthly payment starts and you're home." },
    ],
    faqs: [
      { q: "How do VA loans work?", a: "The VA doesn't lend money directly — they guarantee a portion of the loan, which lets lenders offer zero down payment and no PMI. You still get your mortgage from a lender like us, but the VA backing means better terms." },
      { q: "What is the VA funding fee?", a: "A one-time fee of 1.25-3.3% of the loan amount, depending on your down payment and whether it's your first VA loan. It can be rolled into the loan. Veterans with service-connected disabilities are exempt." },
      { q: "Can I use my VA benefit more than once?", a: "Yes. VA loan entitlement can be reused. If you've paid off a previous VA loan or sold the home, your full entitlement is typically restored." },
      { q: "Do VA loans have loan limits?", a: "For veterans with full entitlement, there are no loan limits — you can borrow as much as a lender will approve. Reduced entitlement borrowers may have county-based limits." },
    ],
  },
  {
    slug: "jumbo",
    name: "Jumbo Loans",
    shortName: "Jumbo",
    tagline: "Above conforming limits for Portland's premium properties — competitive rates even at $1M+.",
    description: "Jumbo loans exceed the conforming loan limits set by the Federal Housing Finance Agency. In the Portland metro area, any mortgage above the conforming limit requires a jumbo loan. These are common for buyers in neighborhoods like Dunthorpe, Lake Oswego, West Hills, and the Pearl District where home prices regularly exceed conforming limits.",
    icon: "squircle",
    seo: {
      title: "Jumbo Loans Portland Oregon | The Lindley Team",
      description: "Jumbo mortgage loans for Portland's premium properties. Competitive rates on loans above conforming limits. Expert guidance for high-value purchases.",
      keywords: ["jumbo loan Portland", "jumbo mortgage Oregon", "high value mortgage Portland", "Portland luxury home loan"],
      aeoQuestion: "What is a jumbo loan and do I need one in Portland?",
    },
    heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    whoFor: ["Buyers purchasing above conforming loan limits", "High-net-worth individuals", "Buyers in Portland's premium neighborhoods", "Self-employed professionals with strong financials"],
    requirements: [
      { label: "Credit Score", value: "700+ typically required" },
      { label: "Down Payment", value: "10-20% typical" },
      { label: "Reserves", value: "6-12 months of payments in liquid assets" },
      { label: "DTI Ratio", value: "Under 43% preferred" },
      { label: "Documentation", value: "Extensive — full asset documentation required" },
    ],
    pros: ["Finance Portland's highest-value properties", "Competitive rates available", "Various term options (15, 20, 30 year)", "Interest-only options available on some programs"],
    cons: ["Higher credit score and down payment requirements", "More extensive documentation", "Rates can be slightly higher than conforming", "Fewer lender options — we know which ones are competitive"],
    process: [
      { step: "01", title: "Financial Review", desc: "Jumbo qualification requires thorough financial documentation. We review everything upfront to avoid surprises." },
      { step: "02", title: "Lender Matching", desc: "Not all lenders offer competitive jumbo products. We match you with the best jumbo lender for your profile." },
      { step: "03", title: "Underwriting", desc: "Jumbo underwriting is more detailed. We prepare your file meticulously to ensure smooth approval." },
      { step: "04", title: "Close", desc: "Closing on a jumbo loan follows the same process — just bigger numbers." },
    ],
    faqs: [
      { q: "What is the jumbo loan limit in Portland?", a: "Any loan above the current conforming limit is considered jumbo. This limit is updated annually by the FHFA. We'll confirm the current limit for your specific county during our initial conversation." },
      { q: "Are jumbo loan rates higher?", a: "Historically yes, but the gap has narrowed significantly. In some cases, jumbo rates are actually competitive with or even below conforming rates. It depends on your credit profile and down payment." },
      { q: "Can I get a jumbo loan with less than 20% down?", a: "Some programs allow 10-15% down on jumbo loans, but you'll likely pay a higher rate. With 20%+ down, you get the best rates and avoid any additional costs." },
    ],
  },
  {
    slug: "cash-out",
    name: "Cash-Out Refinance",
    shortName: "Cash-Out",
    tagline: "Turn your home equity into capital — consolidate debt, fund renovations, or invest.",
    description: "A cash-out refinance replaces your existing mortgage with a larger one, and you receive the difference in cash. If your home is worth $600,000 and you owe $350,000, you have $250,000 in equity. A cash-out refi lets you tap into that equity for home improvements, debt consolidation, investments, or any other purpose — at mortgage rates that are typically far lower than credit cards, personal loans, or HELOCs.",
    icon: "hexagon",
    seo: {
      title: "Cash-Out Refinance Portland | Tap Your Equity | The Lindley Team",
      description: "Cash-out refinance in Portland. Turn your home equity into capital for renovations, debt consolidation, or investment. Licensed in OR/WA.",
      keywords: ["cash out refinance Portland", "home equity cash out Oregon", "cash out refi Portland", "tap home equity Oregon"],
      aeoQuestion: "How much equity can I cash out of my home?",
    },
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    whoFor: ["Homeowners with significant equity built up", "Those consolidating high-interest debt", "Homeowners funding major renovations", "Real estate investors leveraging equity for new purchases"],
    requirements: [
      { label: "Equity", value: "Must retain 20% equity after cash-out (conventional)" },
      { label: "Credit Score", value: "620+ (conventional), 580+ (FHA)" },
      { label: "DTI Ratio", value: "Under 50%" },
      { label: "Seasoning", value: "6+ months since last transaction" },
      { label: "LTV", value: "Up to 80% (conventional), 85% (FHA)" },
    ],
    pros: ["Lower rates than credit cards, personal loans, or HELOCs", "Tax-deductible interest if used for home improvements", "Single monthly payment replaces multiple debts", "No restrictions on how you use the cash"],
    cons: ["Increases your mortgage balance", "Closing costs of 2-3%", "Resets amortization if you extend the term", "Your home is the collateral — defaulting risks foreclosure"],
    process: [
      { step: "01", title: "Equity Analysis", desc: "We estimate your home's current value and calculate how much cash you can access while maintaining 20% equity." },
      { step: "02", title: "Purpose Review", desc: "We discuss what the cash is for and whether a cash-out refi is the best tool vs. HELOC or other options." },
      { step: "03", title: "Rate & Structure", desc: "We compare products to find the best rate for your cash-out amount and desired term." },
      { step: "04", title: "Close & Fund", desc: "After closing, you typically receive your cash within 3 business days." },
    ],
    faqs: [
      { q: "How much can I cash out?", a: "On a conventional cash-out refinance, you can borrow up to 80% of your home's current value. If your home is worth $600,000, you can have a total loan of $480,000. Subtract what you currently owe, and the rest is your cash." },
      { q: "Is a cash-out refinance better than a HELOC?", a: "It depends. Cash-out refi gives you a fixed rate and a single payment. HELOC gives you a revolving credit line at a variable rate. We cover HELOCs on a separate page and can help you compare both options." },
      { q: "Do I pay taxes on cash-out refinance money?", a: "No — cash from a refinance is not taxable income because it's borrowed money, not earned income. However, if you use the funds for home improvements, the interest may be tax-deductible." },
    ],
  },
  {
    slug: "heloc",
    name: "HELOC",
    shortName: "HELOC",
    tagline: "A flexible credit line secured by your home — draw what you need, when you need it.",
    description: "A Home Equity Line of Credit (HELOC) works like a credit card secured by your home. You're approved for a maximum credit limit based on your equity, and you can draw from it as needed during the draw period (typically 10 years). You only pay interest on what you borrow. HELOCs are ideal for ongoing expenses like home renovations, education costs, or as an emergency fund — situations where you don't need all the money at once.",
    icon: "ellipse",
    seo: {
      title: "HELOC Portland Oregon | Home Equity Line of Credit | The Lindley Team",
      description: "HELOC in Portland — flexible home equity credit line. Draw what you need, pay interest only on what you use. Licensed in OR/WA.",
      keywords: ["HELOC Portland", "home equity line of credit Oregon", "HELOC rates Portland", "HELOC vs cash out refinance"],
      aeoQuestion: "How does a HELOC work and should I get one?",
    },
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    whoFor: ["Homeowners funding phased renovations", "Those wanting a financial safety net", "Homeowners with ongoing large expenses", "Those who prefer flexible borrowing over lump sum"],
    requirements: [
      { label: "Equity", value: "15-20%+ equity in your home" },
      { label: "Credit Score", value: "680+ for best rates" },
      { label: "DTI Ratio", value: "Under 43% typically" },
      { label: "Draw Period", value: "5-10 years" },
      { label: "Repayment Period", value: "10-20 years after draw period ends" },
    ],
    pros: ["Only pay interest on what you draw", "Flexible — use and repay as needed", "Lower rates than credit cards or personal loans", "Interest may be tax-deductible for home improvements"],
    cons: ["Variable interest rates can increase", "Your home secures the debt", "Draw period ends — then full repayment begins", "Can tempt over-borrowing if not disciplined"],
    process: [
      { step: "01", title: "Equity & Needs Assessment", desc: "We determine your available equity and discuss your borrowing needs to confirm HELOC is the right fit." },
      { step: "02", title: "Application & Appraisal", desc: "We apply with lenders offering the best HELOC terms. Your home is appraised to determine the credit limit." },
      { step: "03", title: "Approval & Access", desc: "Once approved, you receive checkbook or card access to your credit line." },
      { step: "04", title: "Draw & Repay", desc: "Use funds as needed during the draw period. Interest-only payments during draw; principal + interest during repayment." },
    ],
    faqs: [
      { q: "HELOC vs. cash-out refinance — which should I choose?", a: "HELOC if you need flexible, ongoing access to funds and want to keep your current mortgage intact. Cash-out refi if you want a lump sum at a fixed rate and are okay replacing your existing mortgage." },
      { q: "Are HELOC rates fixed or variable?", a: "Most HELOCs have variable rates tied to the prime rate. Some lenders offer fixed-rate options or the ability to lock portions of your balance at a fixed rate." },
      { q: "Can I lose my home with a HELOC?", a: "Yes — a HELOC is secured by your home. If you default on payments, the lender can foreclose. This is why we emphasize only borrowing what you can comfortably repay." },
    ],
  },
  {
    slug: "investment",
    name: "Investment Property Loans",
    shortName: "Investment",
    tagline: "Build wealth through Portland real estate — we handle the unique qualification requirements.",
    description: "Investment property loans finance properties you won't live in — rentals, flips, or multi-unit buildings. They come with different rules than primary residence loans: higher down payments, higher rates, and stricter qualification. But Portland's rental market makes investment properties a strong wealth-building strategy when financed correctly. We work with investors at every level, from first-time landlords buying a duplex to experienced investors scaling their portfolio.",
    icon: "diamond",
    seo: {
      title: "Investment Property Loans Portland | The Lindley Team",
      description: "Investment property financing in Portland. DSCR loans, conventional investment mortgages, and portfolio strategies. Build wealth through Oregon real estate.",
      keywords: ["investment property loan Portland", "rental property mortgage Oregon", "DSCR loan Portland", "Portland real estate investor financing"],
      aeoQuestion: "How do I finance an investment property in Portland?",
    },
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    whoFor: ["First-time rental property buyers", "Experienced investors scaling their portfolio", "House flippers needing purchase + rehab financing", "Buyers of multi-unit properties (2-4 units)"],
    requirements: [
      { label: "Down Payment", value: "15-25% depending on property type" },
      { label: "Credit Score", value: "680+ for best rates" },
      { label: "Reserves", value: "6 months of payments per property" },
      { label: "DSCR Option", value: "Qualify on rental income, not personal income" },
      { label: "Experience", value: "Some programs require prior landlord experience" },
    ],
    pros: ["Build long-term wealth through appreciation and cash flow", "Rental income can cover mortgage payments", "DSCR loans let you qualify on property income, not personal income", "Tax benefits: depreciation, expense deductions, 1031 exchanges"],
    cons: ["Higher down payments and rates than primary residence", "Landlord responsibilities and vacancy risk", "More complex qualification", "Each property adds to your debt load"],
    process: [
      { step: "01", title: "Strategy Session", desc: "We discuss your investment goals, target returns, and portfolio strategy. First property or tenth — the approach is different." },
      { step: "02", title: "Product Matching", desc: "Conventional, DSCR, portfolio — we match the right loan product to your investment strategy." },
      { step: "03", title: "Analysis & Approval", desc: "We underwrite the deal, analyze cash flow projections, and secure approval." },
      { step: "04", title: "Close & Cash Flow", desc: "You close, place tenants, and start building wealth." },
    ],
    faqs: [
      { q: "How much do I need to put down on an investment property?", a: "Typically 15% for a single-family rental and 20-25% for multi-unit or DSCR loans. House hacking (living in one unit of a multi-unit) lets you use primary residence down payments as low as 3.5% (FHA)." },
      { q: "What is a DSCR loan?", a: "A Debt Service Coverage Ratio (DSCR) loan qualifies you based on the property's rental income rather than your personal income. If the rent covers 1.0-1.25x the mortgage payment, you can qualify regardless of your W2 income. Great for self-employed investors or those with multiple properties." },
      { q: "Can I use rental income to qualify?", a: "Yes. On conventional loans, we can use 75% of documented rental income. On DSCR loans, the property's income is the primary qualification factor." },
    ],
  },
  {
    slug: "reverse-mortgage",
    name: "Reverse Mortgage",
    shortName: "Reverse",
    tagline: "Access your home's equity without monthly payments — designed for homeowners 62 and older.",
    description: "A reverse mortgage (formally a Home Equity Conversion Mortgage or HECM) lets homeowners aged 62+ convert part of their home equity into cash without selling the home or making monthly mortgage payments. Instead, the loan is repaid when the homeowner sells, moves out, or passes away. It's not the right fit for everyone, but for the right situation, it can be a powerful tool for supplementing retirement income, eliminating existing mortgage payments, or funding aging-in-place modifications.",
    icon: "split-circle",
    seo: {
      title: "Reverse Mortgage Portland Oregon | HECM | The Lindley Team",
      description: "Reverse mortgages in Portland for homeowners 62+. Eliminate monthly payments, access home equity, age in place. Honest guidance — not a sales pitch.",
      keywords: ["reverse mortgage Portland", "HECM Oregon", "reverse mortgage 62+", "Portland reverse mortgage lender"],
      aeoQuestion: "How does a reverse mortgage work in Oregon?",
    },
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    whoFor: ["Homeowners 62+ with significant home equity", "Retirees who want to eliminate monthly mortgage payments", "Seniors needing funds for healthcare or aging-in-place modifications", "Homeowners who want to supplement retirement income"],
    requirements: [
      { label: "Age", value: "62+ (youngest borrower)" },
      { label: "Equity", value: "Significant equity — typically 50%+" },
      { label: "Occupancy", value: "Must be primary residence" },
      { label: "Counseling", value: "HUD-approved counseling required" },
      { label: "Property", value: "Single-family, 2-4 unit, condo, or manufactured home" },
    ],
    pros: ["No monthly mortgage payments", "Stay in your home", "Non-recourse — you'll never owe more than the home's value", "Multiple payout options (lump sum, line of credit, monthly payments)", "Proceeds are tax-free"],
    cons: ["Loan balance grows over time as interest accrues", "Reduces inheritance for heirs", "Upfront costs can be significant", "Must maintain the home and pay taxes/insurance", "Moving out triggers repayment"],
    process: [
      { step: "01", title: "Education & Counseling", desc: "We explain how reverse mortgages work honestly — pros AND cons. HUD-approved counseling is required before application." },
      { step: "02", title: "Application & Appraisal", desc: "We determine how much you can access based on age, home value, and current interest rates." },
      { step: "03", title: "Underwriting", desc: "Financial assessment ensures you can maintain the home, pay taxes, and maintain insurance." },
      { step: "04", title: "Close & Access Funds", desc: "Choose your payout option and start accessing your equity — with no monthly payment due." },
    ],
    faqs: [
      { q: "How does a reverse mortgage work?", a: "Instead of you paying the bank each month, the bank pays you — either as a lump sum, monthly payments, or a credit line. The loan balance (plus interest) is repaid when you sell, move out, or pass away. You retain ownership of the home the entire time." },
      { q: "Will I lose my home with a reverse mortgage?", a: "No. You retain full ownership. The loan becomes due only when you sell, move out permanently, or pass away. Your heirs can choose to repay the loan and keep the home, or sell it." },
      { q: "How much can I get from a reverse mortgage?", a: "It depends on your age, home value, and current interest rates. Generally, older borrowers with more equity and lower rates can access more. Our calculator can give you an estimate." },
      { q: "Are reverse mortgage proceeds taxable?", a: "No. Reverse mortgage funds are loan proceeds, not income, so they're not subject to income tax. They also don't affect Social Security benefits (though they may affect Medicaid — consult a financial advisor)." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
