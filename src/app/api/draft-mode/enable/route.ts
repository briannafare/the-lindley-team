import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Enables Next draft mode so editors can see unpublished changes.
 * Guarded by a shared secret so the public cannot read drafts.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (!process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Preview is not configured', { status: 500 })
  }
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Invalid preview secret', { status: 401 })
  }

  draftMode().enable()
  redirect(slug ? `/blog/${slug}` : '/blog')
}
