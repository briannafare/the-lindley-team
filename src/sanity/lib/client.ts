import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, studioUrl } from '@/sanity/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN for published reads. Draft reads below bypass it.
  useCdn: true,
  perspective: 'published',
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
