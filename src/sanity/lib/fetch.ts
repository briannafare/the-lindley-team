import 'server-only'
import { draftMode } from 'next/headers'
import type { QueryParams } from 'next-sanity'
import { client, draftClient } from '@/sanity/lib/client'

/**
 * Thin fetch wrapper. Published reads are cached and busted on-demand by the
 * /api/revalidate webhook via cache tags, with a 10-minute time-based backstop:
 * on 2026-11-07 two auto-published posts were live at their own URLs but missing
 * from /blog for 10 days, because the index was cached forever and no webhook
 * fired. Draft reads are always uncached.
 */
const BACKSTOP_SECONDS = 600
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<T> {
  const isDraft = draftMode().isEnabled

  if (isDraft) {
    if (!process.env.SANITY_API_READ_TOKEN) {
      throw new Error('Draft mode requires SANITY_API_READ_TOKEN')
    }
    return draftClient.fetch<T>(query, params, {
      cache: 'no-store',
      next: { revalidate: 0 },
    })
  }

  return client.fetch<T>(query, params, {
    next: { revalidate: BACKSTOP_SECONDS, tags },
  })
}
