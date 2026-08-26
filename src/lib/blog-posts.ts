// DEPRECATED — blog content now lives in Sanity (see src/sanity/).
// Retained only as the historical record of the WordPress -> Next slug
// mapping behind the 301s hardcoded in next.config.mjs. Nothing imports
// this file any more. Safe to delete once those redirects are verified.

// Blog post data migrated from WordPress (thelindleyteam.com)
// Full content included where available; remaining posts need content fetched from URLs below

export interface BlogPost {
  slug: string;
  oldSlug: string; // WordPress URL for 301 redirect
  title: string;
  excerpt: string;
  date: string; // Original publish date — preserve for SEO
  category: "divorce-lending" | "first-time-buyers" | "refinance" | "traditional" | "current-homeowners";
  image?: string;
  content: string; // Full post content in markdown
}

export const blogPosts: BlogPost[] = [
  {
    slug: "spousal-identity-theft-divorce",
    oldSlug: "/exploring-spousal-identity-theft-and-its-ramifications-on-divorce-proceedings/",
    title: "Exploring Spousal Identity Theft and its Ramifications on Divorce Proceedings",
    excerpt: "Spousal identity theft constitutes a particularly deceptive form of identity fraud, wherein one partner in a marriage illicitly utilizes the other's data without consent.",
    date: "2024-03-06",
    category: "divorce-lending",
    image: "/images/blog/spousal-identity-theft.png",
    content: `Spousal identity theft constitutes a particularly deceptive form of identity fraud, wherein one partner in a marriage illicitly utilizes the other's data, such as social security numbers, banking details, or credit card information, without obtaining prior consent. This act of betrayal not only undermines the victim's financial stability but also inflicts profound emotional distress and a pervasive sense of mistrust in relationships. The dissolution of a marriage often brings this type of deception to light, adding an intricate layer of betrayal and legal entanglements to the already challenging process of divorce.

## Comprehensive Insight into Spousal Identity Theft

Spousal identity theft transpires when one spouse secretly exploits the other's credentials for purposes ranging from financial advantage to the deliberate sabotage of the partner's creditworthiness and standing. The intimate nature of the marital relationship often renders the victim's personal information readily accessible, facilitating such fraudulent activities.

### Implications for Divorce Proceedings

The revelation of spousal identity theft can significantly exacerbate the complexities of divorce proceedings. Financial deceit injects additional discord and skepticism into negotiations concerning asset allocation, alimony, and child support. Moreover, it necessitates pursuing supplementary legal measures, encompassing criminal charges against the offender and civil litigation to alleviate the financial and reputational damage inflicted upon the victim.

**Legal Dynamics:** Victims must navigate the dual legal landscapes of family law and identity theft legislation. This journey initiates with the daunting task of substantiating the theft, a particularly challenging endeavor given the commonality of joint financial ventures in marriages.

**The Emotional Consequences:** The repercussions of spousal identity theft extend beyond mere financial detriment, engendering significant emotional turmoil. Victims often grapple with feelings of vulnerability, outrage, and a profound erosion of trust.

## Ten Signs of Spousal Identity Theft

1. **Discrepancies in Financial Disclosure:** Unexplained assets and debts in your spouse's disclosure can hint at financial activities conducted in your name without your consent.
2. **Unfamiliar Debts During Asset Division:** The division of assets can uncover debts one spouse was unaware of.
3. **Secret Accounts Come to Light:** Discovering secret bank or credit accounts in your name that were previously unknown.
4. **Credit Report Anomalies:** New accounts, inquiries, or debts one spouse did not authorize.
5. **Inconsistencies in Credit Card Statements:** Charges or accounts that a spouse does not recognize.
6. **Disputes Over Debt Responsibility:** If your spouse insists certain debts are solely your responsibility, yet you have no knowledge of them.
7. **Unexplained Financial Hardship:** Financial standing significantly worse than expected.
8. **Unauthorized Withdrawals or Transfers:** Unauthorized withdrawals from joint accounts.
9. **Sudden or Unexplained Changes in Lifestyle:** Spouse has access to financial resources that don't match their known income.
10. **Legal or Collection Notices for Unrecognized Debts:** Receiving notices for debts you did not incur.

## Strategies for Protection and Recovery

- **Immediate Reporting:** Alert credit bureaus about fraudulent activities and place fraud alerts on credit reports.
- **Evidence Compilation:** Amass all documentation indicative of the fraudulent activities.
- **Legal Counsel:** Engage attorneys well-versed in family law and identity theft.
- **Financial Decoupling:** Disentangle financial dealings from those of the spouse.
- **Credit Rehabilitation:** Dispute unauthorized transactions and debts with credit bureaus.

## How a CDLP Can Help

A Certified Divorce Lending Professional (CDLP) is a specialized mortgage professional with additional training to assist individuals going through divorce with their mortgage and financial needs. A CDLP can help with:

- Identifying Impact on Mortgage Financing
- Strategic Financial Planning
- Liaising with Legal and Financial Professionals
- Guidance on Credit Repair and Debt Management
- Educating on Mortgage Options and Rights
- Navigating Post-Divorce Mortgage Challenges`,
  },
  {
    slug: "financial-fallout-divorce-credit",
    oldSlug: "/the-underestimated-financial-fallout-why-divorcing-spouses-often-overlook-the-impact-on-their-financial-and-credit-profiles/",
    title: "The Underestimated Financial Fallout: Why Divorcing Spouses Often Overlook the Impact on Their Financial and Credit Profiles",
    excerpt: "Divorce, commonly perceived as a legal and emotional journey, also unfolds as a significant financial odyssey, profoundly affecting the monetary and credit standing of those involved.",
    date: "2024-01-09",
    category: "divorce-lending",
    image: "/images/blog/financial-fallout-divorce.jpg",
    content: `Divorce, commonly perceived as a legal and emotional journey, also unfolds as a significant financial odyssey, profoundly affecting the monetary and credit standing of those involved. This crucial aspect, however, frequently falls into the shadows, overshadowed by the immediate emotional distress and the labyrinth of legal proceedings.

## Why Financial Impact Gets Overlooked

The reasons behind this oversight are multifaceted:

- **Emotional strain** clouds judgment and hinders rational decision-making
- **Legal complexities** are daunting and overwhelming
- **Lack of financial literacy** — many individuals aren't actively involved in financial decisions
- **Societal tendency** to view divorce as personal/legal rather than financial

## Credit Score Implications

- **Joint Accounts:** Jointly held accounts remain a shared responsibility until officially separated
- **Missed Payments:** Financial strain can lead to missed payments, significantly impacting credit scores
- **Closing Joint Accounts:** Affects credit utilization ratios and length of credit history

## Debt Obligations and Management

- **Division of Debt:** Complex process influenced by state laws
- **Refinancing Joint Debts:** Removes one spouse's liability, protecting their credit
- **Post-Divorce Credit:** Individuals face the challenge of rebuilding credit independently

## Asset Division and Financial Repercussions

- **Liquid vs. Illiquid Assets:** Different implications for immediate and future financial health
- **Tax Implications:** Certain assets come with tax burdens upon sale or transfer
- **Retirement Funds:** Divorce can severely impact retirement savings

## Rebuilding Financial Identity Post-Divorce

- Establishing individual credit accounts
- Budgeting and adapting to single-income lifestyle
- Reevaluating financial plans, savings goals, and investment strategies

A Certified Divorce Lending Professional (CDLP) is crucial in helping divorcing spouses navigate the complex intersection of divorce, real estate, and mortgage financing.`,
  },
  // REMAINING POSTS — content needs to be fetched from URLs
  // Claude Code: fetch each URL below and extract the article content
  {
    slug: "divorce-mortgage-planning-cdlp",
    oldSlug: "/the-primary-misunderstanding-about-divorce-mortgage-planning-with-a-certified-divorce-lending-professional/",
    title: "The Primary Misunderstanding About Divorce Mortgage Planning with a Certified Divorce Lending Professional",
    excerpt: "Divorce is a multifaceted process that involves not only emotional and legal considerations but also significant financial implications.",
    date: "2023-11-15",
    category: "divorce-lending",
    content: `<p>Divorce is a multifaceted process that involves not only emotional and legal considerations but also significant financial implications.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "cdlp-real-property-detail-report",
    oldSlug: "/cdlp-divorce-mortgage-planning-and-real-property-detail-report/",
    title: "CDLP Divorce Mortgage Planning and Real Property Detail Report",
    excerpt: "In a divorce, we are often more focused on curing the problem than understanding the full financial picture.",
    date: "2023-02-01",
    category: "divorce-lending",
    content: `<p>In a divorce, we are often more focused on curing the problem than understanding the full financial picture.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "tips-working-mortgage-brokers",
    oldSlug: "/mortgage-this-5-tips-for-working-with-mortgage-brokers/",
    title: "Mortgage This: 5 Tips for Working With Mortgage Brokers",
    excerpt: "Did you know traditional financial institutions provide only 1/3 of all mortgages?",
    date: "2022-11-28",
    category: "traditional",
    content: `<p>Did you know traditional financial institutions provide only 1/3 of all mortgages?</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "navigating-residential-mortgage-market",
    oldSlug: "/navigating-the-residential-mortgage-market-a-guide/",
    title: "Navigating the Residential Mortgage Market: A Guide",
    excerpt: "This year, the average rate for a fixed 30-year mortgage has fluctuated significantly.",
    date: "2022-11-27",
    category: "traditional",
    content: `<p>This year, the average rate for a fixed 30-year mortgage has fluctuated significantly.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "refinance-15-year-vs-extra-payments",
    oldSlug: "/is-refinance-mortgage-to-a-15-year-better-than-making-extra-payments/",
    title: "Is Refinance Mortgage to a 15 Year Better Than Making Extra Payments",
    excerpt: "Now is a great time to refinance your home. But which approach saves more?",
    date: "2022-11-21",
    category: "refinance",
    content: `<p>Now is a great time to refinance your home. But which approach saves more?</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "mortgage-points-interest-rates",
    oldSlug: "/what-are-mortgage-points-and-how-do-they-affect-interest-rates/",
    title: "What Are Mortgage Points and How Do They Affect Interest Rates",
    excerpt: "If you're preparing to buy a house, you know there's a lot to learn about mortgage financing.",
    date: "2022-11-15",
    category: "first-time-buyers",
    content: `<p>If you're preparing to buy a house, you know there's a lot to learn about mortgage financing.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "mortgage-report-refinancing-options",
    oldSlug: "/how-a-mortgage-report-can-help-you-understand-your-refinancing-options/",
    title: "How a Mortgage Report can Help You Understand Your Refinancing Options",
    excerpt: "What if you could learn all about your refinancing options in one comprehensive report?",
    date: "2022-11-08",
    category: "refinance",
    content: `<p>What if you could learn all about your refinancing options in one comprehensive report?</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "mortgage-without-credit-score",
    oldSlug: "/getting-a-mortgage-without-a-credit-score-your-complete-guide/",
    title: "Getting a Mortgage Without a Credit Score: Your Complete Guide",
    excerpt: "Americans pay an average of $1,588 per month for a mortgage.",
    date: "2022-11-05",
    category: "first-time-buyers",
    content: `<p>Americans pay an average of $1,588 per month for a mortgage.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "mortgage-refinance-rates-worth-it",
    oldSlug: "/are-mortgage-refinance-rates-worth-it-tips-to-save-you-serious-money/",
    title: "Are Mortgage Refinance Rates Worth It: Tips to Save You Serious Money",
    excerpt: "Now is a great time to refinance your mortgage. Interest rates remain competitive.",
    date: "2022-11-01",
    category: "refinance",
    content: `<p>Now is a great time to refinance your mortgage. Interest rates remain competitive.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "government-home-loans-guide-2",
    oldSlug: "/using-government-home-loans-for-your-next-purchase-everything-you-need-to-know-2/",
    title: "Using Government Home Loans for Your Next Purchase: Everything You Need to Know",
    excerpt: "Using Government Home Loans for Your Next Purchase. Are you considering a government-backed loan?",
    date: "2022-09-27",
    category: "first-time-buyers",
    content: `<p>Using Government Home Loans for Your Next Purchase. Are you considering a government-backed loan?</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "adjustable-rate-vs-fixed-rate",
    oldSlug: "/adjustable-rate-mortgages-versus-fixed-rate-mortgages-whats-right-for-you/",
    title: "Adjustable-Rate Mortgages Versus Fixed-Rate Mortgages: What's Right for You?",
    excerpt: "If you have ever wanted to understand better the adjustable-rate vs fixed-rate decision.",
    date: "2022-09-26",
    category: "traditional",
    content: `<p>If you have ever wanted to understand better the adjustable-rate vs fixed-rate decision.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "mortgage-refinance-plain-english",
    oldSlug: "/what-is-a-mortgage-refinance-in-plain-english-2/",
    title: "What Is a Mortgage Refinance, In Plain English",
    excerpt: "Are you faced with the opportunity to refinance your home?",
    date: "2022-09-22",
    category: "refinance",
    content: `<p>Are you faced with the opportunity to refinance your home?</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "private-mortgage-insurance-good-bad",
    oldSlug: "/private-mortgage-insurance-is-neither-good-nor-bad-2/",
    title: 'Private Mortgage Insurance Is Neither "Good" Nor "Bad"',
    excerpt: "Have you been told that PMI is always bad? The truth is more nuanced.",
    date: "2022-09-20",
    category: "first-time-buyers",
    content: `<p>Have you been told that PMI is always bad? The truth is more nuanced.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "government-home-loans-guide",
    oldSlug: "/using-government-home-loans-for-your-next-purchase-everything-you-need-to-know/",
    title: "Using Government Home Loans for Your Next Purchase: Everything You Need to Know",
    excerpt: "The housing market was blazing for more than two years, and government programs can help.",
    date: "2022-09-19",
    category: "first-time-buyers",
    content: `<p>The housing market was blazing for more than two years, and government programs can help.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "interest-rate-volatility-guide",
    oldSlug: "/what-is-interest-rate-volatility-your-guide/",
    title: "What Is Interest Rate Volatility? Your Guide",
    excerpt: "If you're looking to purchase your first home, you're probably watching interest rates closely.",
    date: "2022-09-12",
    category: "first-time-buyers",
    content: `<p>If you're looking to purchase your first home, you're probably watching interest rates closely.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "20-percent-down-payment-2",
    oldSlug: "/before-you-put-a-20-percent-down-payment-on-a-house-read-this-2/",
    title: "Before You Put a 20 Percent Down Payment On a House: Read this",
    excerpt: "Are you planning on putting down 20% of the full purchase price?",
    date: "2022-09-06",
    category: "first-time-buyers",
    content: `<p>Are you planning on putting down 20% of the full purchase price?</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "20-percent-down-payment",
    oldSlug: "/before-you-put-a-20-percent-down-payment-on-a-house-read-this/",
    title: "Before You Put a 20 Percent Down Payment On a House: Read this",
    excerpt: "According to reports, 2 in 5 people think that 20% down is required.",
    date: "2022-09-04",
    category: "first-time-buyers",
    content: `<p>According to reports, 2 in 5 people think that 20% down is required.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "beginners-guide-refinance-options",
    oldSlug: "/a-beginners-guide-to-understanding-mortgage-refinance-options/",
    title: "A Beginner's Guide to Understanding Mortgage Refinance Options",
    excerpt: "If the term 'refinance' sounds like it belongs to another language, you're not alone.",
    date: "2022-08-31",
    category: "refinance",
    content: `<p>If the term 'refinance' sounds like it belongs to another language, you're not alone.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "stop-paying-pmi",
    oldSlug: "/3-surprisingly-simple-ways-to-stop-paying-private-mortgage-insurance-pmi/",
    title: "3 Surprisingly Simple Ways to Stop Paying Private Mortgage Insurance (PMI)",
    excerpt: "It's no secret that owning real estate is one of the best ways to build wealth.",
    date: "2022-08-24",
    category: "current-homeowners",
    content: `<p>It's no secret that owning real estate is one of the best ways to build wealth.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "comprehensive-guide-pmi",
    oldSlug: "/a-comprehensive-guide-to-the-ins-and-outs-of-private-mortgage-insurance-pmi/",
    title: "A Comprehensive Guide to the Ins and Outs of Private Mortgage Insurance (PMI)",
    excerpt: "Chances are, you've heard some buzz about the record low interest rates.",
    date: "2022-08-17",
    category: "first-time-buyers",
    content: `<p>Chances are, you've heard some buzz about the record low interest rates.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
  {
    slug: "interest-rates-affect-mortgage-payments",
    oldSlug: "/what-are-interest-rates-and-how-do-they-affect-mortgage-payments/",
    title: "What Are Interest Rates (And How Do They Affect Mortgage Payments?)",
    excerpt: "Each year, nearly 700,000 homes are sold in the United States.",
    date: "2022-05-27",
    category: "first-time-buyers",
    content: `<p>Each year, nearly 700,000 homes are sold in the United States.</p><p><em>Full article coming soon. <a href="/contact">Contact Bri</a> with questions.</em></p>`,
  },
];

// Helper to generate 301 redirect entries for next.config.mjs
export function generateBlogRedirects() {
  return blogPosts.map((post) => ({
    source: post.oldSlug.replace(/\/$/, ""),
    destination: `/blog/${post.slug}`,
    permanent: true,
  }));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

// NOTE FOR CLAUDE CODE:
// 19 posts still need full content fetched. For each post with content: "CONTENT_NEEDED",
// fetch the URL at: https://thelindleyteam.com{oldSlug}
// Extract the article body content (skip nav, footer, sidebar)
// Convert to markdown and replace the "CONTENT_NEEDED" string
// Preserve all headings, lists, bold text, and links
