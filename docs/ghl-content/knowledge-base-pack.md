# The Lindley Team — GHL Knowledge Base Pack

What the Conversation AI (chat/SMS) and Voice AI agents read to answer accurately. The agents' behavior/voice
lives in their system prompts (`docs/ghl-content/chat-voice-agents.md`); this is the *facts* they draw from.
Everything here is Movement-correct. Rates are never stated by the agent, only by David or Bri.

---

## 1. How to wire it in GHL

GHL → AI → Knowledge Base → add these sources:

| # | Source | Type | Refresh | Why |
|---|---|---|---|---|
| 1 | `thelindleyteam.com` | Web crawler, full domain | Weekly | The site already holds all 16 loan pages, every neighborhood, the calculator, and FAQs. This is the backbone. |
| 2 | Section 3 below ("Core reference") | Text/DOCX upload "Services & Business Info" | Manual | Crisp facts the crawl states as marketing; the agent needs the plain version. |
| 3 | `docs/lindley-product-types.csv` | CSV table "Product Types" | Manual | Semantic match: "I'm self-employed, taxes look low" → surfaces Bank Statement without the visitor knowing the name. |
| 4 | Oregon OHCS homeownership | Web crawler, path-level | Monthly | DPA programs change; keeps first-time answers current. |
| 5 | FHFA conforming loan limits | Web crawler, exact URL | Monthly | So "what's the jumbo cutoff" stays right without manual edits. |
| 6 | Custom Bot Responses (Section 4) | Manual entries | As needed | Exact-answer overrides for the questions that must not be improvised (rates, broker/bank, licensing). |

Do **not** crawl a Freddie Mac / rate-survey source into an agent that talks to prospects. The agent never quotes
rates, so a rate source only creates temptation to slip. Keep rate talk routed to David or Bri.

---

## 2. Agent goals (recap — full behavior is in the agent prompts)

1. Be useful fast: answer the real question from this KB in plain words.
2. Learn who they are naturally: first name early, then email/phone woven in assumptively. Never a form interrogation.
3. Book the right calendar for the intent (general / rate-strategy / first-time / divorce).
4. Route anything licensed (rates, "do I qualify", terms, legal/tax) to David or Bri. Never guess or invent numbers.
5. Keep an accurate running summary in the AI Conversation Summary field so David and Bri pick it up cold.

---

## 3. Core reference (the "Services & Business Info" source)

### Who
The Lindley Team is David Chandler and Bri Lindley, two loan officers at Movement Mortgage (NMLS #39179) in Portland,
Oregon. A lead always works with David or Bri directly.
- **Bri Lindley** — Senior Loan Officer, NMLS #1367416. CDLP (Certified Divorce Lending Professional), one of few in
  Oregon. Licensed OR & WA. Grew up in Portland.
- **David Chandler** — 20+ years, NMLS #265974. Licensed AZ, CA, GA, OR, WA. Deep on jumbo, new construction,
  self-employed (bank-statement/DSCR), and investment. Invests in real estate himself.
- Office: 15115 SW Sequoia Parkway, Suite 100, Portland, OR 97224. Phone 971-754-1771.
  david.chandler@movement.com · brianna.lindley@movement.com. Hundreds of five-star reviews across the two of them.

### Positioning (say it in your own words; never break this frame)
Loan officers at Movement Mortgage. Same personal service you'd get from a small team, but with more loan programs
in-house instead of brokered out, which means faster answers and real flexibility on pricing. Movement is a bigger
company with deeper resources, and it's an Impact Lender (10%+ of profits go to communities). Never "we're a bank,"
never "we shop hundreds of lenders," never "broker," never "correspondent lender."

### Service area
Team works Oregon and Washington. David is also individually licensed in Arizona, California, and Georgia. Outside
those states, say so plainly.

### Loan programs (plain one-liners; the site pages have the detail)
- **Purchase** — the loan to buy a home. Most are simpler than they feel.
- **Refinance** — replace your current loan to lower the payment, change the term, or pull cash out. Only worth it
  sometimes; we'll tell you if it is.
- **Divorce lending** — untangling the house in a divorce (buyout, refinance, one-income qualifying). Bri's CDLP work.
- **FHA** — lower down payment and more flexible credit; common for first-time buyers.
- **VA** — for eligible veterans and service members; often zero down, no monthly mortgage insurance.
- **USDA** — zero-down loans in eligible rural/suburban areas.
- **Conventional** — the standard loan; strong option with decent credit and steady income.
- **Jumbo** — for loan amounts above the conforming limit; higher-value homes. David's wheelhouse.
- **HELOC** — a line of credit against your home equity you draw from as needed.
- **Cash-out refinance** — refinance for more than you owe and take the difference in cash.
- **Investment** — financing for rental and investment property.
- **Reverse mortgage** — for homeowners 62+ to convert equity into funds without a monthly mortgage payment.
- **New construction** — financing a home being built.
- **Bank statement** — qualify using bank deposits instead of tax returns; for self-employed borrowers.
- **DSCR** — qualify an investment property on its own rental income, not your personal income.
- **Down payment assistance** — Oregon (OHCS) and other programs that help with the down payment; can stack with
  low-down loans. We help you find and use them.

### How it goes
1. We talk numbers, the real ones, so you know where you stand before you fall for a house.
2. You get pre-approved, usually inside 24 to 48 hours. A letter Portland sellers take seriously.
3. We close on time. We handle the paperwork and moving parts.

### Divorce lending (handle with care)
Keeping a house in a divorce usually runs through a refinance: it pays out the spouse's share of equity and takes
their name off the loan. Qualifying on one income is the common worry and is often more workable than it looks,
because support/maintenance can sometimes count as income when the settlement is written and timed the right way. That
wording is far easier to set up before the divorce is final than to fix after, which is why a CDLP should be involved
early. Bri is a Certified Divorce Lending Professional and handles these confidentially.

### Neighborhoods
The site documents Portland neighborhoods in depth (median prices, schools, parks, vibe, commute). Use the crawled
pages for specifics. Bri grew up here and reads the city by neighborhood. Never quote a median price you can't see in
the KB; if unsure, say Bri can give them the real read.

---

## 4. Custom Bot Responses (exact answers — locked voice, no em dashes, "complimentary" not "free")

**Q: What are your current rates? / What's your rate on a 30-year?**
A: Rates move every day and depend a lot on your specific situation, so any number I gave you would be a guess with a
short shelf life. The useful version is a real quote from David or Bri built on your actual numbers. Want me to set
that up, or grab a time on the calendar?

**Q: Are you a broker or a bank?**
A: Neither, really. David and Bri are loan officers at Movement Mortgage, so most loan programs are in-house instead
of sent out to another lender. That's where the faster answers and the flexibility on pricing come from.

**Q: Do you charge for a consultation?**
A: No, the consult is complimentary. You bring your situation, David or Bri give you a straight read, and if something
doesn't make sense they'll tell you.

**Q: What types of loans do you offer?**
A: Pretty much the full shelf: conventional, FHA, VA, USDA, jumbo, plus bank-statement and DSCR for self-employed and
investors, construction, reverse, HELOCs, cash-out, and down payment assistance. Tell me your situation and I'll point
you to the one that fits.

**Q: Am I licensed in my state? / Do you cover [state]?**
A: The team works Oregon and Washington, and David is also licensed in Arizona, California, and Georgia. Where are you
buying? If it's outside those, I'll tell you straight rather than string you along.

**Q: Who is Tammi Lindley?**
A: Tammi founded The Lindley Team and built it one straight conversation at a time. The two people you'd work with now
are David and Bri, same standard she set.

**Q: Are you a real person?**
A: You're chatting with the team's assistant. David or Bri reads every conversation, and I can get you straight to
either of them whenever you want.

**Q: Can you tell me if I'd qualify?**
A: That's exactly the kind of thing David or Bri should answer for real, not me guessing. It takes about twenty
minutes with your numbers. Want the calendar link, or should I have one of them reach out?

*(When someone pushes for specific terms after any of these: "Not a commitment to lock or lend. Terms and restrictions
apply.")*
