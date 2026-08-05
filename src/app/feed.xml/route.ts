import { client } from '@/sanity/lib/client'
import { postsQuery } from '@/sanity/lib/queries'
import type { PostCard } from '@/sanity/lib/types'

const SITE = 'https://thelindleyteam.com'

export const revalidate = 3600

function esc(s = '') {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  const posts = await client.fetch<PostCard[]>(postsQuery)

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.excerpt)}</description>
      ${p.categoryLabel ? `<category>${esc(p.categoryLabel)}</category>` : ''}
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Lindley Journal</title>
    <link>${SITE}/blog</link>
    <description>Portland mortgage insights from The Lindley Team at Movement Mortgage.</description>
    <language>en-us</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
