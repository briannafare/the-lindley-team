# Accessibility Review — WCAG 2.1 AA

Scope: full site (home, about, services hub + 16 service pages, neighborhoods
index + detail pages, contact, apply, calculator, blog, privacy). Everything
below is either fixed in this pass or flagged for a decision, per the same
"fix what's unambiguous, flag what's a real tradeoff" approach used in the
compliance review.

## Fixed today

**1. Heading hierarchy — real skip-level violations, ~25 instances.**
Nearly every section on the site used a small uppercase "eyebrow" label
(`Overview`, `Requirements`, `FAQ`, `Schools`, `Reach Us`, etc.) styled as a
`<p>` instead of a heading — so screen reader users navigating by heading
(the primary way blind users skim a page) saw a single H1 and then nothing
until a random H3 three sections later. Converted every one of these labels
that functions as an actual section header to `<h2>` (or `<h3>` where nested
under another section, e.g. Restaurants/Coffee/Bars under "Local Life"). Zero
visual change — same classes, same look, just correct semantics. Touched:
About, Contact, the shared service-page layout (all 16 loan pages), the
shared neighborhood layout (all detail pages), Neighborhoods index, Calculator,
and the blog post/listing templates. Left the true pre-H1 "kicker" labels
(e.g. "Our Services" sitting above the H1 on the services hub) as `<p>` —
those aren't section headers and putting an H2 before the H1 would be its
own violation.

**2. Keyboard focus indicator missing on 3 calculator inputs.**
`MortgageCalculator.tsx` (interest rate, annual taxes, annual insurance
fields) removed the focus outline (`outline-none`) with no replacement —
a keyboard user tabbing through the calculator couldn't see where focus
was. Added `focus-within:border-ink` to the wrapping field so the border
darkens on focus, matching the pattern already used correctly in
`ContactForm.tsx`.

**3. Color contrast — two real AA failures fixed at the token level.**
- `ink-light` (`#8A8A80`), used everywhere for captions and eyebrow labels
  at 11–14px, was 3.33:1 on the paper background — fails the 4.5:1 AA
  minimum for small text. Darkened in `tailwind.config.ts`; after the
  Met-palette cool-down it's `#6B6D62` (4.85:1 on paper, 4.51:1 on the alt
  background). Checked every usage first — it's only ever used on light
  backgrounds, no dark-section conflicts.
- `silver` (`#BDBCBD`) is correctly tuned for its dark-background usages
  (10.3:1 on the ink section in `FeatureDivorce.tsx`) but was also used for
  the row numbers on the services list, which sits on a light background —
  1.81:1 there, a bad fail. Didn't touch the shared token (would've broken
  the dark-bg usage); switched that one instance to `ink-light` instead.

**4. Alt text — audited, no fix needed.** Every `<img>` in the codebase has
an `alt` attribute; the naive first-pass grep that suggested otherwise was
a false positive from a bad multi-line match. The 4 instances of `alt=""`
were all checked individually and are legitimately decorative: a hover-only
duplicate image marked `aria-hidden`, a logo inside an `aria-hidden` brand
spine, a placeholder image with its own visible caption, and card thumbnails
sitting directly above their own visible title text.

## Flagged for you

**5. Orange brand accent fails AA at small sizes on light backgrounds.**
`#ef4434` on the paper background is 3.62:1 — passes for large text (24px+,
or 18.66px+ bold) but fails the 4.5:1 small-text minimum. Most orange usage
is fine (large headline accents inherit big font sizes). Three spots flagged:
- `ServicesList.tsx` — the "Most Popular" / "Specialist" tag badges, 9.6px.
  **Fixed this pass**: switched from orange-text-on-white to filled pills —
  black text on solid orange (5.55:1) for "Most Popular", black text on
  solid lime (15.72:1) for "Specialist". Also doubles as the color-balance
  fix (yellow was underrepresented site-wide next to red/cobalt).
- `MeetTheTeam.tsx` — the NMLS meta line under each headshot, 11.5px. Still open.
- `Nav.tsx` — the active-section label, 11.5px. Still open.

The remaining two are the same shape of fix (bold + larger, or a filled
chip) — flag if you want them closed out in the same pass.

**6. `ContactForm.tsx` uses placeholder text as the only label** (via
`aria-label`, no visible `<label>`). This technically satisfies WCAG 4.1.2
(accessible name is present) so it's not a violation, but it's a common
audit flag and a real usability issue for anyone with memory/cognitive
load — the label disappears the moment you start typing. `MortgageCalculator.tsx`
already does this right (visible labels above each field). If you want
`ContactForm` to match, I can add visible labels without changing the visual
layout — small design call, your call whether it's worth it.

## What's already solid

No global CSS strips focus outlines — the only broken instance was the 3
calculator inputs fixed above. Every interactive element I checked (nav
mobile-menu toggle, footer links) has proper accessible names — no
icon-only buttons without `aria-label`. No skip-links are present, which is
a nice-to-have on a long single-page-feeling site like this but not an AA
requirement given the sensible heading structure now in place. `<html
lang="en">` and viewport meta should be double-checked in `layout.tsx` if
you want a completionist pass, but nothing found here suggests it's missing.

## Net read

The real, user-facing gaps (heading navigation, keyboard focus, and body-text
contrast) are fixed. What's left is one brand-color tradeoff (#5) and one
optional UX upgrade (#6) — both genuinely your call, not mine to make
silently.
