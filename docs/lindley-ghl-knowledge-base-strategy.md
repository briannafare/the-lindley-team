# GHL Knowledge Base — Complete Strategy
## Using EVERY available feature for The Lindley Team

---

## KNOWLEDGE BASE SOURCES (Add all of these)

### Source 1: DOCX Upload — "Services & Business Info"
**File:** `lindley-team-knowledge-base.docx` (already built — download from outputs)
**What it contains:** Team bios, Movement Mortgage positioning, all service descriptions, FAQ library, contact info, compliance text, booking info
**Update frequency:** Manual — update when services or business info change

### Source 2: CSV Table — "Product Types"
**File:** `lindley-product-types.csv` (already built — download from outputs)
**What it contains:** 20 broad product categories organized by type (Core, Non-QM, Specialty, Equity, Assistance, Government). Each row has what it is, who it is for, key benefit, and whether it's a core in-house program or a specialty program on Movement's shelf. No specific lender names or guidelines that go stale — just enough for the AI to know what we CAN do and route to Bri for specifics
**Why CSV:** GHL's Table Search uses semantic matching — a visitor can ask "I'm self-employed and my tax returns look low" and the AI will surface Bank Statement Loans without the visitor knowing the product name
**Update frequency:** Manual — update when Movement's program shelf or your offerings change

### Source 3: CSV Table — "Portland Neighborhoods"
**File:** `lindley-portland-neighborhoods.csv` (already built — download from outputs)
**What it contains:** 10 priority neighborhoods with median prices, vibe descriptions, schools, parks, restaurants, walk/bike/transit scores, commute times
**Update frequency:** Quarterly — update median prices and any new restaurant/business changes

### Source 4: Web Crawler — Your New Website
**URL:** `https://thelindleyteam.com` (once the Next.js site is live)
**Crawl type:** Full Domain
**What it captures:** All service pages, neighborhood pages, blog posts, calculator page, FAQ content — everything Claude Code is building
**Auto-Refresh:** Set to WEEKLY
**Why weekly:** Blog posts, neighborhood content, and market data pages get updated regularly. Weekly refresh keeps the AI current with your latest content.

### Source 5: Web Crawler — FHFA Conforming Loan Limits
**URL:** `https://www.fhfa.gov/data/conforming-loan-limit`
**Crawl type:** Exact URL
**Auto-Refresh:** MONTHLY
**Why:** Conforming loan limits change annually (announced in November, effective January). Monthly refresh catches the update within 30 days. Your AI agent will know the current limits without you manually updating anything.

### Source 6: Web Crawler — Freddie Mac Rate Survey
**URL:** `https://www.freddiemac.com/pmms`
**Crawl type:** Exact URL
**Auto-Refresh:** WEEKLY
**Why:** The Primary Mortgage Market Survey publishes every Thursday. Your AI agent can reference general rate trends (but should always say "for your specific rate, contact Bri" — never quote exact rates to prospects).

### Source 7: Web Crawler — Oregon OHCS Housing Programs
**URL:** `https://www.oregon.gov/ohcs/homeownership/pages/default.aspx`
**Crawl type:** Path-level (crawl subpages under homeownership)
**Auto-Refresh:** MONTHLY
**Why:** Oregon down payment assistance programs change periodically. Monthly refresh ensures your AI agent has current program info when first-time buyers ask about DPA.

### Source 8: Web Crawler — Movement Mortgage Company Info
**URL:** `https://easyapp.movement.com/`
**Crawl type:** Exact URL
**Auto-Refresh:** MONTHLY
**Why:** Keeps your AI current with any company-level changes (licensing, compliance language, contact info).

### Source 9: Custom Bot Responses (FAQ Overrides)
**Purpose:** When you need the AI to give an EXACT answer (not interpreted). These override any crawled/uploaded content.

**Add these manually in GHL → Knowledge Base → Custom Bot Responses:**

Q: "What are your current rates?"
A: "Rates change daily based on market conditions and your specific financial profile. Rather than giving you a number that'll be outdated by tomorrow, I'd recommend connecting with Bri for a personalized rate quote based on your situation. You can call or text 971-754-1771, or I can help you schedule a time."

Q: "Are you a broker or a bank?"
A: "We're loan officers at Movement Mortgage. Same personal service you'd get from a small team, with a big company behind us, so most of our loan programs are in-house instead of brokered out. That means faster answers, more control of your file, and real room to be flexible on pricing. And if a specialty program fits your situation better, Movement's shelf is deep enough to find it."

Q: "What types of loans do you offer?"
A: "We offer a much wider range than most lenders. Beyond conventional, FHA, VA, and jumbo, we have bank statement loans for self-employed borrowers, DSCR loans for investors, ITIN loans, construction/renovation financing, bridge loans, manufactured home loans, reverse mortgages, HELOCs, down payment assistance programs, and more. Movement's program shelf runs deep, so specialty situations most lenders turn away usually have a path here. What's your situation? I can point you toward the right product."

Q: "Do you charge for consultations?"
A: "No — consultations with Bri are complimentary. Schedule a 30-minute conversation and she'll review your situation honestly. If something doesn't make sense, she'll tell you."

Q: "Are you licensed in my state?"
A: "The Lindley Team is currently licensed in Oregon and Washington. If you're purchasing or refinancing a property in either state, we can help."

Q: "Who is Tammi Lindley?"
A: "Tammi is Bri's mom and co-founded The Lindley Team. She built the business over two decades before stepping back from active lending. Bri continues the team with the same values and relationships Tammi established, plus fresh tools and modern approach."

---

## AUTO-REFRESH SCHEDULE SUMMARY

| Source | Refresh | Why |
|---|---|---|
| Your website | Weekly | Blog posts, content updates |
| FHFA loan limits | Monthly | Annual change, monthly catches it |
| Freddie Mac rates | Weekly | Published every Thursday |
| Oregon OHCS | Monthly | Program changes periodically |
| Movement Mortgage | Monthly | Company info changes rarely |
| Product types CSV | Manual | You control when products change |
| Neighborhoods CSV | Quarterly | Prices and businesses shift slowly |
| Services DOCX | Manual | Core business info changes rarely |

---

## CONNECTING KB TO YOUR WEBSITE

When loan limits change, or rates shift significantly, your Knowledge Base updates automatically via auto-refresh. But the WEBSITE content also needs to reflect changes. Here's how to handle it:

### Dynamic Content Strategy:

**Content that should update automatically:**
- Rate trend references on blog posts → Don't hardcode rates. Write "current market rates" and link to your calculator page
- Loan limit references → Write "current conforming loan limits" and link to FHFA source. Don't hardcode dollar amounts
- DPA program details → Reference "Oregon OHCS programs" generically and link to the programs page

**Content that needs manual updates:**
- Median home prices on neighborhood pages → Update quarterly in Sanity CMS (later) or directly
- Service page requirements → Update in `services.ts` when guidelines change
- Product types CSV → Update when Movement's program shelf changes

**Claude Code note:** Tell Claude Code to NEVER hardcode loan limits, specific rate numbers, or DPA dollar amounts in the website. Always use language like "current conforming loan limits" or "today's rates" and point to your calculator or a contact CTA. This way the content never goes stale.

---

## WHAT YOUR AI AGENTS NOW KNOW

With all 9 sources configured, your Conversation AI and Voice AI agents can accurately answer:

- "What loans do you offer?" → 27 product types from the CSV
- "I'm self-employed, can I get a loan?" → Bank Statement Loans
- "What neighborhoods are good for families under $500k?" → Semantic search on neighborhoods CSV
- "What's the current conforming loan limit?" → Auto-refreshed from FHFA
- "How are rates trending?" → Weekly Freddie Mac data (with caveat to contact Bri for specifics)
- "Do you do ITIN loans?" → Ask us and we'll check the current program options for your situation
- "Can I buy a manufactured home?" → Yes, on land or in parks, multiple options
- "Tell me about Sellwood" → Neighborhood-specific data
- "What DPA programs are available in Oregon?" → Auto-refreshed from OHCS
- "What is a CDLP?" → From your services DOCX
- "How does an equity buyout work?" → From your divorce lending content
- All FAQ content from your website → Auto-refreshed weekly

---

## GHL HELP LINKS

| Feature | URL |
|---|---|
| KB Document/Rich Text Upload | https://help.gohighlevel.com/support/solutions/articles/155000006671-knowledge-base-document-rich-text-support |
| KB Table/CSV Upload | https://help.gohighlevel.com/support/solutions/articles/155000006637-ai-agents-knowledge-base-tables |
| Web Crawler Setup | https://help.gohighlevel.com/support/solutions/articles/155000006625-knowledge-base-web-crawler |
| Enhanced Web Crawler | https://help.gohighlevel.com/support/solutions/articles/155000006625-knowledge-base-enhanced-web-crawler |
| Auto-Refresh Setup | https://help.gohighlevel.com/support/solutions/articles/155000006539-auto-refresh-of-knowledge-base-trained-links |
| Bot Training Guide | https://help.gohighlevel.com/support/solutions/articles/155000004416-training-your-conversation-ai-bot |
| Voice AI KB Integration | https://help.gohighlevel.com/support/solutions/articles/155000005266-knowledge-base-integration-for-voice-ai-agents |
