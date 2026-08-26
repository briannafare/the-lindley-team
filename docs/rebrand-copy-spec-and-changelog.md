# The Lindley Team → Movement Mortgage — Copy Rebrand Spec & Change Log
*Prepared July 14, 2026 · Bri (Father Bod)*

This is the reference for the site rewrite: positioning, voice, compliance, exactly what changed, and what you still need to swap in. Copy is written **into the live Next.js files** (deploy-ready), not throwaway docs.

---

## 1. Evaluation — live WordPress site vs. merge objectives

The current live site (`thelindleyteam.com`, WordPress/Elementor) is **misaligned with the merge on every count that matters:**

- **Wrong company end-to-end.** It's Mortgage Express, LLC (NMLS 40831), "licensed OR/WA/CA," `mtgxps.com` apply link + email, broker disclosures. All of it is now Movement Mortgage (NMLS #39179), OR/WA footprint.
- **Tammi framed as an active licensed co-founder** — team block, LO-style social proof, testimonials crediting "Tammi… as our mortgage broker." That's now a compliance problem, not just stale.
- **David Chandler is absent** — your strongest new asset (20+ yr LO, NMLS #265974) wasn't on the site.
- **Positioning contradicts reality.** Old pitch = "mortgage lenders aren't like banks… access to hundreds of products" (broker framing). Rewritten per your steer: *still a loan officer, still options + pricing flexibility, now more programs in-house at Movement.*
- **Weak conversion** — generic CTAs to the old portal, unattributed/placeholder testimonials, no lead-magnet funnel into GHL.

The new Next.js build already reflected the merge structurally; this pass fixed the **copy, positioning, compliance, and conversion** gaps on top of it.

---

## 2. Positioning (your steer, locked)

> *"I'm still a loan officer with lots of options and pricing. We just now have more loan programs in-house instead of brokering to another wholesale lender, and I can be flexible with pricing and compete. Movement is just a better company — bigger, deeper pockets."*

**Message frame used everywhere:**
- Same loan officers (David & Bri), same personal service — **not** "we're a bank now."
- What changed: more programs **in-house** at Movement → faster answers, more control of the file, **real flexibility on pricing** to compete.
- Proof of scale without overclaiming: bigger company, deeper resources, full program shelf, **Impact Lender** (Movement commits ≥10% of profits to communities).
- Avoid: "broker," "we shop hundreds of lenders," "difference between a broker and a bank," hard day-count promises.

## 3. Voice
Casual, direct, confident, low-pressure. Dry humor OK. Neighborhood-first ("start with the block, not the rate"). Short, specific, non-cliché. No jargon without a plain-English unpack.

## 4. People & facts (verified)
- **Bri Lindley** — Senior Loan Officer, CDLP, NMLS #1367416, licensed **OR & WA**, grew up in Portland.
- **David Chandler** — Mortgage Loan Officer, NMLS #265974, licensed **AZ, CA, GA, OR, WA**. 20+ yrs, consultative/education-first, hundreds of 5-star reviews (Zillow/Google/FB), specialties: jumbo, new construction, reverse, self-employed (bank-statement/DSCR), investment. Real estate investor. Office: 10135 SE Sunnyside Rd Ste 125, Clackamas OR 97015 · (503) 816-6350 · david.chandler@movement.com. *(Source: his Movement LO page + public profiles.)*
- **Tammi Lindley** — **Founder only.** No LO / licensing / "mortgage broker" language anywhere. Short founder note honoring the legacy; David & Bri are "the team you actually work with today."

## 5. Compliance / disclosure standard
- Company: **Movement Mortgage, LLC · NMLS ID #39179 · Equal Housing Lender.**
- Pair LO NMLS: **David Chandler #265974 · Brianna Lindley #1367416.**
- Team market stated as **OR & WA**; David's fuller AZ/CA/GA/OR/WA list appears on About + Apply.
- Keep the standard "not a commitment to lend; rates/products subject to change; not all applicants qualify" line (already in Footer).
- **CA dropped** from the team footprint vs. the old Mortgage Express license — confirm that's intended for team-level copy (David is individually CA-licensed).

---

## 6. Change log — what I edited (all in `src/`)

**Home**
- `components/Hero.tsx` — subcopy now adds "two licensed loan officers, real programs & pricing you can shop, backed by Movement."
- `components/MeetTheTeam.tsx` — closing line now anchors David's 20+ yrs + Bri's CDLP/local.
- `components/ColorBlockCTA.tsx` — made the "talk to David & Bri" line a real link (→ /contact#schedule).

**About** (`app/about/page.tsx`) — biggest rewrite:
- New hero subline (drops "two generations" mother-daughter frame).
- **Added a full David Chandler bio section** from verified material.
- Credentials block rebuilt as **two columns (Bri + David)** with correct NMLS/licenses.
- Mother-daughter section → **short founder note on Tammi** + "today's team is David & Bri."
- "Why Movement" reframed to your steer (in-house programs + pricing flexibility + Impact Lender, explicitly *not* "a bank").
- Stats band → "40+ combined years / OR + WA / hundreds of 5-star reviews."

**Services** (`lib/services.ts`)
- Killed broker/"our lender network"/"we compare products" phrasing in Purchase + Cash-Out.
- Reworked the "broker vs. bank" FAQ into "Do I work with a person or a call center?" (on-message).
- Refinance meta description de-broker-ified.

**Contact / Apply / Footer**
- `app/contact/page.tsx` — Schedule section relabeled "Grab a Time" + a clearly-marked **GHL booking-calendar embed slot** (drop your LeadConnector iframe in).
- Footer + Apply already Movement-correct (NMLS #39179, LO numbers, easyapp URLs) — verified, left intact.

**New conversion landing page**
- `app/first-time-buyer/page.tsx` — campaign-ready LP: hero, reassurance band, 3-step path, FAQ, and a GHL-fed lead form tagged `source: thelindleyteam.com/first-time-buyer`. Added to sitemap.
- `components/ContactForm.tsx` — added optional `source` prop so landing-page leads get their own GHL attribution (default unchanged).

**Verified:** `npx tsc --noEmit` passes clean; no `Mortgage Express`, `mtgxps`, broker/bank, or licensed-Tammi references remain in `src/`.

---

## 7. Confirmed corrections (applied July 14)
- **CA dropped everywhere** — neither David nor Bri is licensed there anymore. David now shows **AZ, GA, OR & WA**; team footprint stays OR & WA.
- **Experience = "35+ combined years"** on the About stats band (we're one team, not two separate tenures).
- **156 Google reviews / 5.0 kept** — confirmed real for The Lindley Team.

## 8. GHL wiring — built to spec (paste URLs once, it's live)

There is **no live GHL/LeadConnector MCP or CLI in this session** (only the Zapier connector, which is unauthorized here), so calendars/workflows can't be created inside the sub-account from here. Instead the **entire website side is built and waiting on your URLs:**

- **`src/app/api/lead/route.ts`** — all forms POST here with a `formType`; it fans out to the matching GHL webhook and auto-applies the tags from your playbook (`source:website`, `form:schedule-call`, etc.).
- **`src/lib/ghl.ts`** — single source of truth for form types, tags, and per-request-type booking calendars.
- **`src/components/BookingCalendar.tsx`** — renders the right LeadConnector calendar embed by type (schedule / divorce / rate-quote / first-time-buyer), with a graceful call-us fallback until URLs are set. Live on the Contact page's "Grab a Time" section.
- **`ContactForm`** now routes through `/api/lead` with a `formType` (contact page → `schedule`, landing page → `first-time-buyer`).
- **`.env.local.example`** — every variable to paste, with where to get each in GHL.

**To go live, paste into Vercel env (values from your GHL sub-account):**
1. Webhook URLs (GHL → Automation → Workflows → Webhook trigger): `GHL_WEBHOOK_SCHEDULE`, `GHL_WEBHOOK_RATE_QUOTE`, `GHL_WEBHOOK_CALCULATOR`, `GHL_WEBHOOK_NEIGHBORHOOD`, `GHL_WEBHOOK_GUIDE`, `GHL_WEBHOOK_DIVORCE`, `GHL_WEBHOOK_APPLY_CLICK`.
2. Calendar embed URLs (GHL → Calendars → Embed): `NEXT_PUBLIC_GHL_CAL_SCHEDULE` (+ `_DIVORCE`, `_RATE_QUOTE`, `_FIRST_TIME` for the request-specific calendars).

**If you want me to actually build the calendars + workflows *inside* GHL for you:** authorize a GHL connector (or the Zapier connector with GHL enabled) in an interactive session, or drop the sub-account API key, and I'll create the calendars, webhook workflows, tags, and pipeline stages directly.

## 8. Recommended next pass (not done today, per "core pages first")
- Rewrite the remaining 7 service pages (FHA, VA, jumbo, HELOC, investment, reverse, refinance detail) to the same standard.
- Divorce-lending landing page (your #1 differentiator + CDLP) as a second GHL funnel.
- Neighborhood lead-magnet ("what's my home worth / is now the time on my block").
- Swap placeholder testimonials for attributed Movement/Google reviews.
