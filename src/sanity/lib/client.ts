import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, studioUrl } from '@/sanity/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN for published reads. Draft reads below bypass it.
  useCdn: true,
  perspective: 'published',
  // Document reads on this project are governed by role-based content resources
  // (Administrator/Editor/Viewer, no anonymous role), so unauthenticated reads
  // come back as {"omitted":[{"reason":"permission"}]} even though the dataset's
  // visibility is "public" — verified 2026-08-25. Published reads therefore need
  // a viewer token. Safe: every importer of this module is server-side and
  // sanityFetch is `server-only`, so the token never enters the browser bundle.
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl,
    enabled: false,
  },
})

/**
 * Authenticated client used only for draft/preview reads and for the
 * Presentation tool. Never expose SANITY_API_READ_TOKEN to the browser.
 */
export const draftClient = client.withConfig({
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
  stega: { studioUrl, enabled: true },
})
