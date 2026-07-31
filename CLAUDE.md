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

- `mortgage-calculator-suite 2/` is a **separate Next.js project** that ended up
  nested here via a macOS duplicate-on-copy. It is not referenced by the site and
  is not built. It should move to its own repository; it is kept for now only so
  the work is not lost.
- `out/` and `graphify-out/` are generated. Do not commit them.
