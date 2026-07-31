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
