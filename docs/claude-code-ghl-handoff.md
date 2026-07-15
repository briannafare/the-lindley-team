# Handoff → Claude Code (terminal): build the GHL backend + wire it to the site
*Rev 4 — July 14, 2026. GHL sub-account is already connected in this terminal — go straight to building, no access verification needed.*

Copy everything in the fenced block below into Claude Code running in the
`~/Desktop/the-lindley-team` project.

---

```
You're working in the Next.js repo at ~/Desktop/the-lindley-team (The Lindley Team at
Movement Mortgage). The WEBSITE side of GHL integration is already built and type-checks
clean. Your job is to build the GHL (LeadConnector) backend in the Lindley Team
sub-account (location id: pe2yBdfaVo406b3BaavZ) and wire the real URLs back into this repo.
The GHL connection is already available in this terminal — don't stop to verify it, just
use it. Do NOT rewrite the website integration code — it already exists and defines the
contract you must match.

Before creating anything, list existing calendars, workflows, pipelines, and tags in the
sub-account so you don't duplicate what's already there. Use a TEST contact for all
end-to-end tests — never send real email/SMS while testing — and confirm with me before
deleting anything.

═══════════════════════════════════════════════════════════════════════
1) THE CONTRACT (already implemented in this repo — match it exactly)
═══════════════════════════════════════════════════════════════════════
- All site forms POST JSON to `/api/lead` (src/app/api/lead/route.ts), which forwards
  to a GHL inbound webhook chosen by `formType`. Payload shape:
    { name, email, phone, message, formType, source, tags: string[], submittedAt }
- `formType` is one of:
    contact | schedule | rate-quote | calculator | neighborhood | guide |
    divorce | first-time-buyer | apply-click
- LIVE FORMS TODAY (what will actually fire on day one):
    /contact form            → formType "schedule",         source thelindleyteam.com/contact
    /first-time-buyer form   → formType "first-time-buyer", source thelindleyteam.com/first-time-buyer
    Calculator results form  → LEGACY: posts directly to NEXT_PUBLIC_GHL_CALC_WEBHOOK
                               (src/components/calculators/MortgageCalculator.tsx), NOT through
                               /api/lead. Either set that env var to the wh-calculator webhook URL,
                               or migrate the component to POST /api/lead with formType "calculator"
                               (preferred — small change, do it if time allows).
  The other formTypes (rate-quote, neighborhood, guide, divorce, apply-click) are
  pre-wired server-side for landing pages that will use them next — create their
  workflows now so the URLs exist.
- The route reads these PRIVATE env vars (server-side, no NEXT_PUBLIC_):
    GHL_WEBHOOK_SCHEDULE, GHL_WEBHOOK_RATE_QUOTE, GHL_WEBHOOK_CALCULATOR,
    GHL_WEBHOOK_NEIGHBORHOOD, GHL_WEBHOOK_GUIDE, GHL_WEBHOOK_DIVORCE, GHL_WEBHOOK_APPLY_CLICK
  (formType `contact`, `schedule`, and `first-time-buyer` all currently map to
   GHL_WEBHOOK_SCHEDULE.)
- Booking calendars render from these PUBLIC env vars (src/lib/ghl.ts → BookingCalendar):
    NEXT_PUBLIC_GHL_CAL_SCHEDULE, NEXT_PUBLIC_GHL_CAL_DIVORCE,
    NEXT_PUBLIC_GHL_CAL_RATE_QUOTE, NEXT_PUBLIC_GHL_CAL_FIRST_TIME
  Calendar embed URL format: https://api.leadconnectorhq.com/widget/booking/{calendarId}
  BookingCalendar currently renders on /contact ("Grab a Time" section). Types without a
  configured URL fall back to NEXT_PUBLIC_GHL_CAL_SCHEDULE automatically.
- SITE CONTEXT for tagging/nurture: the site now has 16 loan-type pages under /services/*
  (purchase, refinance, divorce-lending, fha, va, usda, jumbo, conventional, heloc, cash-out,
  investment, reverse-mortgage, new-construction, bank-statement, dscr, down-payment-assistance)
  plus /first-time-buyer. Their CTAs point to /apply and /contact#schedule. The GHL chat widget
  (location pe2yBdfaVo406b3BaavZ) already injects page context, so chat conversations know which
  loan page the visitor was on — build the chat agent's routing with that in mind.
- Full var list + notes are in `.env.local.example`.

═══════════════════════════════════════════════════════════════════════
2) BUILD IN GHL — pipeline
═══════════════════════════════════════════════════════════════════════
Create (or reuse) an Opportunities pipeline "Lindley Team — Borrower Pipeline" with stages:
  1 New Lead → 2 Attempted Contact → 3 Discovery Scheduled → 4 Application Started →
  5 In Process → 6 Clear to Close → 7 Closed–Won → 8 Closed–Lost
New website leads enter at stage 1. When a calendar appointment is booked, move to stage 3.

═══════════════════════════════════════════════════════════════════════
3) BUILD IN GHL — calendars (one per request type)
═══════════════════════════════════════════════════════════════════════
Create these calendars, assign David Chandler + Bri Lindley (round-robin or per-owner as I
prefer — ask me if unsure), connect their Google/Outlook so personal events block time,
then capture each calendar's embed URL:
  A. "Consultation — 30 min" (general)        → NEXT_PUBLIC_GHL_CAL_SCHEDULE
  B. "Divorce Lending — private consult"      → NEXT_PUBLIC_GHL_CAL_DIVORCE
  C. "Rate / Strategy call"                   → NEXT_PUBLIC_GHL_CAL_RATE_QUOTE
  D. "First-Time Buyer — intro call"          → NEXT_PUBLIC_GHL_CAL_FIRST_TIME
Booking form fields: First Name, Last Name, Email, Phone, "What are you looking to do?"
(Buy, Refinance, Divorce/Equity, Cash-Out/HELOC, Investment, Not Sure).
On appointment booked → apply tag `booked:consult` and move opportunity to stage 3.

═══════════════════════════════════════════════════════════════════════
4) BUILD IN GHL — inbound-webhook workflows (one per form)
═══════════════════════════════════════════════════════════════════════
For each row: Automation → Workflows → new workflow → trigger = Inbound Webhook, then
actions: Upsert/Create Contact (map name/email/phone/message from the JSON payload) →
Add Tags (static, per table) → Create Opportunity in "Lindley Team — Borrower Pipeline"
at stage 1 → Notify David & Bri (internal email/SMS) → start the appropriate nurture.
Copy the generated webhook URL into the matching env var.

  Workflow name        | formType(s)                         | Static tags                          | Env var
  wh-schedule-call     | contact, schedule, first-time-buyer | source:website, form:schedule-call   | GHL_WEBHOOK_SCHEDULE
  wh-rate-quote        | rate-quote                          | source:website, form:rate-quote      | GHL_WEBHOOK_RATE_QUOTE
  wh-calculator        | calculator                          | source:website, form:calculator      | GHL_WEBHOOK_CALCULATOR
  wh-neighborhood      | neighborhood                        | source:website, form:neighborhood    | GHL_WEBHOOK_NEIGHBORHOOD
  wh-guide-download    | guide                               | source:website, form:guide-download  | GHL_WEBHOOK_GUIDE
  wh-divorce-consult   | divorce                             | source:website, form:divorce-consult | GHL_WEBHOOK_DIVORCE
  wh-apply-click       | apply-click                         | source:website, clicked-apply        | GHL_WEBHOOK_APPLY_CLICK

Note: the site also sends a `tags` array in the payload — you can ignore it and apply the
static tags above in each workflow (simpler + safer). Use the payload only for contact fields.
Tip: submit the form once (or send a sample POST) so GHL can capture the sample payload and
you can map fields visually.

═══════════════════════════════════════════════════════════════════════
5) WIRE URLS BACK INTO THE REPO
═══════════════════════════════════════════════════════════════════════
- Write all values into ~/Desktop/the-lindley-team/.env.local (create from .env.local.example).
- Set the same keys in Vercel (Production + Preview) for this project.
- Do NOT edit src/app/api/lead/route.ts, src/lib/ghl.ts, src/components/BookingCalendar.tsx,
  or src/components/ContactForm.tsx unless a mapping genuinely requires it — they already
  read these vars. If you change one, keep the env-var names identical.

═══════════════════════════════════════════════════════════════════════
6) COMPLIANCE — MAP Rule 24-month recordkeeping (build this, don't skip it)
═══════════════════════════════════════════════════════════════════════
The FTC/CFPB Mortgage Acts and Practices Advertising Rule (Reg N, 12 CFR 1014)
requires anyone advertising mortgage credit terms to keep a copy of every commercial
communication — website copy, emails, SMS, chat scripts, nurture sequences, any ad
creative — for 24 months from the LAST date it was used, along with enough
information to show who received it and when it ran. This isn't optional and it
isn't satisfied by "the workflow still exists in GHL" — GHL templates get edited
in place, which destroys the historical record the rule requires. Build an actual
archive, not a note:
  a. Create a GHL folder/tag system (e.g. a dedicated "Compliance Archive" saved-
     replies or documents folder, whatever your plan supports) and export a dated
     snapshot (PDF or saved copy) of every live email/SMS template and workflow
     message body at the moment you finish this build. File name pattern:
     `YYYY-MM-DD_workflow-name_template-name.pdf`.
  b. Any time a template, nurture email, SMS body, or the chat widget's scripted
     responses is edited going forward, export a new dated snapshot BEFORE saving
     the change, so the prior version is preserved — don't overwrite history.
  c. Do the same for the live website copy: keep a dated export (screenshot or
     saved HTML) of each page whenever its marketing/rate/offer language changes
     materially. A monthly full-site snapshot is a reasonable default if per-edit
     tracking isn't practical.
  d. Store snapshots somewhere durable outside GHL itself if possible (Google
     Drive folder, S3 bucket, whatever Bri already uses) — GHL account changes or
     template deletions shouldn't be able to erase the record.
  e. Set a recurring reminder (calendar or GHL task) to check at least once a year
     that nothing required is missing from the archive. You do NOT need to purge
     anything past 24 months — over-retention isn't a violation, under-retention is.
Report back where you set this up and how it's triggered (manual export step vs.
automated), so Bri knows the actual process going forward.

═══════════════════════════════════════════════════════════════════════
7) TEST + REPORT
═══════════════════════════════════════════════════════════════════════
- `npm run dev` (this project serves on port 3001), submit the /contact form and the
  /first-time-buyer form with a TEST contact; confirm each lands in GHL with the right
  tags + stage-1 opportunity + notification, and that the two arrive with DIFFERENT
  form tags (form:schedule-call vs form:first-time-buyer).
- Test the calculator path: either confirm NEXT_PUBLIC_GHL_CALC_WEBHOOK delivers, or
  migrate the component to /api/lead formType "calculator" and test that.
- Confirm each BookingCalendar renders (Contact page "Grab a Time") and a test booking
  creates a calendar event and moves the opp to stage 3.
- Fire one test POST at each of the not-yet-used webhooks (rate-quote, neighborhood,
  guide, divorce, apply-click) so every workflow has a captured sample payload.
- Delete/archive the TEST contacts when done.
- Report back: every calendarId + webhook URL created, the env keys set (local + Vercel),
  where the compliance archive from step 6 lives and how it's triggered, and anything
  I still need to click in GHL (calendar owner connections, notification recipients,
  nurture copy).
```

---

## After Claude Code finishes
Redeploy on Vercel (or `vercel --prod`) so the new env vars ship. Then the website
forms → GHL workflows → pipeline, and the booking calendars self-book — all live.
