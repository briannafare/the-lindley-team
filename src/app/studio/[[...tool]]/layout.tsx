import type { Metadata } from 'next'

/**
 * Route config and page metadata live here, in the server layout, because
 * `page.tsx` has to be a Client Component — see the note in that file.
 */
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'The Lindley Journal',
  robots: { index: false, follow: false },
}

/**
 * The Studio must not inherit the marketing site's padded / rounded shell.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div style={{ margin: '-0.5rem' }}>{children}</div>
}
