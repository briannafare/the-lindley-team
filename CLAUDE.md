# The Lindley Team — project rules

Next.js 14 (App Router) marketing site for The Lindley Team at Movement Mortgage.
Deployed on Vercel as the `lindley-preview` project, serving `thelindleyteam.com`.

## Deployment: git is the only path to production

**Never run `vercel`, `vercel --prod`, or `vercel deploy` against this project.**
Production deploys happen by pushing to `main`. Nothing else.

This rule exists because it was already broken once. In July 2026 a session ran a
Vercel CLI deploy from a local machine with an uncommitted working tree. Vercel
accepted it and aliased it to `thelindleyteam.com`, so production ran commit
`762f0912` — which existed in no branch of this repository. 131 files and ~20,000
lines lived only on one laptop and in Vercel's file storage until they were
recovered through the deployment files API.

### Why it went unnoticed for so long

The CLI deploy was the symptom. The cause was that the Vercel project's Production
environment tracked a branch named **`master`**, which has never existed in this
repository — the default has always been `main`. So *no* git push, on any branch,
could ever produce a production deployment. Every push built a preview and stopped
there, which is why deploying from a laptop looked like the only thing that worked.

Fixed on 2026-07-31: Production now tracks `main` (Vercel → Settings →
Environments → Production). If pushes to `main` ever stop publishing, check that
setting first — it is the single point of failure for this whole workflow.

Note that the public Vercel REST API cannot change this value; it is a dashboard
or CLI operation. The API *can* create a production deployment directly
(`POST /v13/deployments` with `target: "production"` and a `gitSource` ref), which
is how the 2026-07-31 release was published before the setting was corrected.

What follows from that:

- `main` is the source of truth and must always match what is live.
- Work on a branch, open a PR, merge to `main`. Let Vercel build from the push.
- If a change is urgent, it is still a push. "Urgent" is not a reason to deploy
  from a local tree — that is exactly how the last incident happened.
- Never commit with a dirty tree you have not reviewed, and never deploy one.
- If you find `Bash(vercel:*)` allowlisted in a local `.claude/settings.local.json`,
  remove it. That permission is what made the incident possible.

## Branches

- `main` — production. Protected by convention: only merge reviewed PRs.
- Feature branches — short-lived, one concern each, deleted after merge.

Historical note: `design/neighborhood-page` was the de-facto working branch for a
period while `main` sat stale, which is what allowed the two to diverge unnoticed.
Do not resurrect that pattern. If `main` is not what is live, stop and fix that
before doing anything else.

## No work lives only on one laptop

Bri works from more than one machine, and often through Claude in the browser,
which can only see what is on GitHub. Anything that exists solely in a local
working tree is invisible there and gets rebuilt from scratch — that has now
happened twice.

The rule: **end every working session with the work pushed somewhere.** A real
branch if it is ready, an `autosave/*` branch if it is not. "I'll commit it
later" is how the July 2026 incident and the August 2026 neighborhoods loss
both started.

`./scripts/git-autosave.sh` does this in one step. It snapshots the entire
working tree — including uncommitted and untracked files, honouring
`.gitignore` — and pushes it to `origin/autosave/<branch>`. It never touches
the working tree, the index, or any real branch, and it never pushes `main`
(which would deploy). Run it before closing the laptop; recover with
`git fetch origin && git checkout autosave/<branch>`.

To make it automatic for every project, wire it to a Claude Code `Stop` hook in
`~/.claude/settings.json`:

```json
"hooks": {
  "Stop": [
    { "hooks": [{ "type": "command",
                  "command": "bash \"$CLAUDE_PROJECT_DIR/scripts/git-autosave.sh\" >/dev/null 2>&1 &" }] }
  ]
}
```

## Verifying a change actually landed

Do not report a change as live because a build succeeded. Confirm it:

- `npm run build` must pass.
- Check the Vercel preview URL that the PR bot comments on the pull request.
- After merge, confirm `thelindleyteam.com` serves the change.

A quick way to tell whether local and production are in sync is to compare a
rendered page's text against the live one — identical character counts and word
sets mean the trees match.

## Integrations

- **GHL / LeadConnector** — config in `src/lib/ghl.ts`. Booking calendars are
  public embed URLs via `NEXT_PUBLIC_GHL_CAL_*`; lead webhooks are private and
  live in Vercel env vars. Forms POST to `/api/lead`, which forwards server-side.
- **June** (`src/components/JuneWidget.tsx`) — the custom-branded voice/chat
  agent. Talks to the real GHL Voice AI agent over LiveKit. The IDs in that file
  are public by design (they ship in the widget embed); do not add private keys
  to it.

Env vars are set in Vercel → Project → Settings → Environment Variables.
See `.env.local.example` for the full list. Never commit a real `.env.local`.

## Repo layout notes

## Calculators

The calculation engine lives in `src/lib/calculators/` (24 modules: DSCR, FHA, VA,
USDA, affordability, rent-vs-buy, house-hacking, cash-to-close, CLTV,
debt-consolidation, tax-deduction, move-up, payment-strategy, and the MI/funding-fee
helpers). It is shared by every calculator UI. Add new math there, not in a
component.

Calculator UIs live in `src/components/calculators/`. `MortgageCalculator` is the
generic one used on `/calculator` and on most service pages; `DscrCalculator`,
`ConventionalCalculator`, and `UsdaCalculator` are purpose-built and are passed
into `ServicePageLayout`'s `calculator` slot on their matching service pages.

A service page opts into a calculator by passing the `calculator` prop — see
`src/app/services/dscr/page.tsx`.

### The rest of the suite

A nested `mortgage-calculator-suite 2/` project used to sit in this repo — a macOS
duplicate-on-copy holding 17 calculator UIs plus a stale copy of the engine (22 of
its 24 lib files were byte-identical to `src/lib/`). It was never referenced or
built by the site. Three of its UIs were ported into `src/components/calculators/`
and wired to the service pages that had no calculator; the folder was then removed.

The other 14 UIs are still worth shipping and remain in git history — the folder is
present in every commit up to and including `d6e22a4`. Ten of them have no matching
service page yet and would need one: affordability, rent-vs-buy, house-hacking,
cash-to-close, CLTV, debt-consolidation, tax-deduction, move-up, buy-now-vs-wait,
payment-strategy.

To port one: copy its `app/<slug>/page.tsx`, strip the standalone page chrome (the
`min-h-screen` shell and sticky header), rename the export, and repoint
`@/components/AmortizationChart` to `@/components/calculators/AmortizationChart`.
The Tailwind config already carries the suite's `ink-*` scale and `surface-*` and
`shadow-card` tokens, and `globals.css` already defines `.input-field`,
`.input-label`, `.input-helper`, and `.result-card`.
- `out/` and `graphify-out/` are generated. Do not commit them.
