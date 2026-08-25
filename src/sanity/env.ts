/**
 * Sanity connection values.
 *
 * The project ID and dataset name are PUBLIC values — they ship in the client
 * bundle by design and are not secrets. `sanity.config.ts` already carries the
 * same literal fallbacks, so keep the two in sync.
 *
 * These used to `throw` when the env vars were absent. That made every
 * production build depend on a value being set correctly in the Vercel
 * dashboard, which is exactly the single-point-of-failure that caused the
 * `master`/`main` deploy incident (see CLAUDE.md). A missing dashboard setting
 * should not be able to break the build of an otherwise-correct commit.
 *
 * Secrets (read token, preview + revalidate secrets) are NOT here. They are
 * read directly by the routes that need them and degrade gracefully.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19'

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dqm3yn14'

export const studioUrl = '/studio'
