# Compliance Review — thelindleyteam.com
*July 14, 2026. Grounded in current federal + Oregon/Washington rules — not a strict-interpretation audit, but enough to avoid the obvious flags. Real legal/compliance decisions still need your compliance officer or counsel; this is a working review, not legal advice.*

**Rules referenced:** Regulation Z / TILA advertising rules (12 CFR 1026.24), the CFPB/FTC Mortgage Acts and Practices Advertising Rule — "MAP Rule" / Regulation N (12 CFR 1014), SAFE Act / NMLS advertising and license-display requirements, VA loan advertising rules (38 CFR / VA Lender's Handbook), HECM/reverse mortgage advertising rules (HUD), the FTC's 2023 Endorsement Guides (16 CFR 255), TCPA consent requirements, Oregon Division of Financial Regulation advertising rule (OAR 441-870-0080), and Washington DFI Consumer Loan Act advertising rules.

---

## Fixed today (no sign-off needed — these were unambiguous gaps)

1. **TCPA consent language was completely missing from every lead form.** Given the GHL playbook calls for auto-dialing leads within 30 seconds, this was real exposure — TCPA violations run $500–$1,500 *per call*. Added a clear, unbundled consent checkbox (unchecked by default) to `ContactForm` — used on both `/contact` and `/first-time-buyer` — with company-specific language, an opt-out instruction, and a note that consent isn't required to get a quote. The consent state and timestamp now flow into the GHL payload so it's actually documented, not just displayed.

2. **No Privacy Policy existed.** The old `/privacy-policy/` URL 301-redirected straight to the homepage — the policy was just gone. Any site collecting names, phone numbers, and financial situations through forms needs one; it's also referenced by the new consent checkbox. Built `/privacy`, fixed the redirect to point there, and linked it in the footer.

3. **Reverse mortgage page was one-sided.** "Access your home's equity without monthly payments" led with the benefit and buried the cost — the CFPB has specifically flagged this pattern in reverse-mortgage advertising (their 2015 report on the topic). Rewrote the tagline/description to state upfront that interest still accrues and taxes/insurance are still owed, and added the HUD-required disclaimer that Movement Mortgage isn't a government agency and isn't endorsed by HUD/FHA — HECM marketing materials are required to say this "in a conspicuous location," not bury it in a footer.

4. **Schema.org data was factually wrong on 12 of 16 pages.** Every service page's structured data hardcoded Bri as the sole provider — including David's specialty pages (jumbo, construction, DSCR, bank-statement). Search engines and AI answer engines read this; misattributing David's own specialty pages to Bri is both an accuracy problem and a self-inflicted AEO problem. Fixed to reflect the team as an organization with both loan officers listed.

5. **Unsubstantiated review claims.** The homepage's "156 five-star reviews" links to your actual Google Business Profile — good, that's how FTC endorsement rules want it done. David's About bio said "hundreds of five-star reviews" with no link. Linked it to the same review source.

6. **Loan-requirement tables read like firm offers.** Added standard qualification language ("not a quote or commitment to lend... not all applicants will qualify... subject to change without notice") to the shared requirements block used on all 16 service pages — this is the plain-English version of what Oregon's rule against advertising "pre-approved" or "prequalified" without disclosing prerequisites is getting at.

---

## Flagged for you — judgment calls, not auto-fixed

**Priority 1 — worth a real look before launch**

7. **Speed/certainty promises.** "We close on time," "usually the same day you ask," pre-approval "24-48 hours" appear across the site. None of these are rule violations on their face, but the MAP Rule prohibits misrepresenting likelihood or timing of outcomes. If these are consistently true for how David and Bri actually operate, leave them — they're good differentiators. If they're aspirational, soften to "our goal is" language. Only you two know which.

8. **CDLP is a certification mark** (owned by the Divorce Lending Association). Not a real compliance risk, but clean practice is to write it as "CDLP®" on first use per page, or add one footnote crediting the certifying body. Low priority, cheap to do whenever you're back in the copy.

9. **Accessibility (WCAG/ADA).** I didn't run a full audit, but mortgage and lending sites are a common target for ADA demand letters. Worth a dedicated pass: alt text on every meaningful image (found 4 empty `alt=""` — need to confirm those are genuinely decorative), form label associations, color contrast on the small uppercase labels. I can run this as a follow-up task if you want it before launch.

**Priority 2 — operational, not code**

10. **MAP Rule recordkeeping.** Once GHL workflows and any AI voice/chat scripts go live, federal rule requires keeping copies of ads, scripts, and marketing materials for 24 months after last use. This is a GHL/ops habit, not a website fix — worth a line in whatever SOP you're building with Claude Code for the GHL buildout.

11. **State license footprint.** Confirmed OR & WA are covered site-wide via the footer (NMLS IDs + "Equal Housing Lender" text). David's individual AZ/GA licenses show correctly on his bio and Apply card. If Movement ever adds a state to either of your licenses, that's a global footer update plus the About page.

---

## What's already solid (confirmed, not just assumed)

- **No advertised interest rate/APR anywhere** — the single most common Reg Z violation (rate without APR) doesn't apply because no specific note rate is quoted site-wide.
- **No FHA/VA/HUD seals or logos used** — avoids the government-endorsement-implication trap entirely.
- **Equal Housing Lender language present** in the footer.
- **NMLS IDs paired correctly** with both officers everywhere they appear, plus company NMLS #39179.
- **Calculator is framed as an estimate**, not a firm quote.
- **169 redirects verified** against the live WordPress sitemap, so no orphaned old URLs are floating around collecting scrutiny post-launch.

---

## Net read

The big legal-exposure items (TCPA, missing privacy policy, one-sided HECM marketing) are fixed. What's left is judgment calls about tone (items 7–8) and a proper accessibility pass (item 9) — none of it blocks launch, but I'd get the accessibility pass done before any real ad spend drives traffic here, since that's the category most likely to draw a demand letter regardless of how clean the mortgage-specific compliance is.
