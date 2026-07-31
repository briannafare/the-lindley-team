import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import type { RevalidatePayload } from '@/sanity/lib/types'

/**
 * Sanity webhook target. Fires on publish/unpublish/delete and busts only the
 * cache tags that actually changed, so a publish is live in ~2s with no rebuild.
 *
 * Sanity Manage > API > Webhooks:
 *   URL        https://thelindleyteam.com/api/revalidate
 *   Dataset    production
 *   Trigger    create, update, delete
 *   Filter     _type == "post" || _type == "author" || _type == "category"
 *   Projection {_type, "slug": slug.current}
 *   Secret     <SANITY_REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<RevalidatePayload>(
      request,
      process.env.SANITY_REVALIDATE_SECRET
    )

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }
    if (!body?._type) {
      return new NextResponse('Bad payload', { status: 400 })
    }

    const tags = new Set<string>(['sitemap'])

    if (body._type === 'post') {
      tags.add('posts')
      if (body.slug) tags.add('post:' + body.slug)
    } else {
      // An author or category edit can change every card on the index.
      tags.add('posts')
      tags.add(body._type)
    }

    const tagList = Array.from(tags)
    tagList.forEach((t) => revalidateTag(t))

    return NextResponse.json({
      revalidated: true,
      tags: tagList,
      now: Date.now(),
    })
  } catch (err) {
    console.error('[revalidate]', err)
    const message = err instanceof Error ? err.message : 'Error'
    return new NextResponse(message, { status: 500 })
  }
}
