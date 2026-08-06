import Image from 'next/image'
import Link from 'next/link'
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from '@portabletext/react'
import { imageUrl } from '@/sanity/lib/image'

const calloutTone: Record<string, string> = {
  note: 'bg-blue/[0.06] border-blue/25',
  warning: 'bg-orange/[0.07] border-orange/30',
  stat: 'bg-yellow/40 border-ink/15',
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-ink-mid leading-[1.8] text-[1.05rem]">{children}</p>
    ),
    h2: ({ children, value }) => (
      <h2
        id={slugify(value)}
        className="font-display text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight text-ink mt-14 mb-4 scroll-mt-28"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={slugify(value)}
        className="font-display text-[1.15rem] font-bold leading-snug text-ink mt-10 mb-3 scroll-mt-28"
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 pl-6 border-l-[3px] border-orange font-serif text-[1.35rem] leading-[1.45] text-ink">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 pl-5 list-disc marker:text-orange space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 pl-5 list-decimal marker:text-ink-light marker:font-bold space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-ink-mid leading-[1.75] text-[1.05rem]">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-ink-mid leading-[1.75] text-[1.05rem]">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-ink">{children}</strong>
    ),
    link: ({ children, value }) => {
      const external = value?.newTab || /^https?:\/\//.test(value?.href ?? '')
      return (
        <a
          href={value?.href}
          className="text-ink underline decoration-orange decoration-2 underline-offset-[3px] hover:text-orange transition-colors"
          {...(external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      )
    },
    internalLink: ({ children, value }) => (
      <Link
        href={`/blog/${value?.reference?.slug?.current ?? ''}`}
        className="text-ink underline decoration-orange decoration-2 underline-offset-[3px] hover:text-orange transition-colors"
      >
        {children}
      </Link>
    ),
  },

  types: {
    figure: ({ value }) =>
      value?.asset ? (
        <figure className="my-12">
          <div className="relative w-full aspect-[16/9] rounded-[14px] overflow-hidden bg-shell">
            <Image
              src={imageUrl(value, 1440)}
              alt={value.alt || ''}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>
          {value.caption ? (
            <figcaption className="mt-3 text-[0.8rem] text-ink-light">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null,

    callout: ({ value }) => (
      <aside
        className={`my-10 rounded-[14px] border p-6 ${
          calloutTone[value?.tone as string] ?? calloutTone.note
        }`}
      >
        {value?.heading ? (
          <p className="font-display font-extrabold text-ink mb-2 text-[1.05rem]">
            {value.heading}
          </p>
        ) : null}
        <div className="[&>p]:mb-3 [&>p:last-child]:mb-0 [&>p]:text-ink-mid [&>p]:leading-[1.7] [&>p]:text-[0.98rem]">
          <PortableText value={value?.text ?? []} components={components} />
        </div>
      </aside>
    ),

    ctaBlock: ({ value }) => (
      <div className="my-14 rounded-[16px] bg-yellow px-8 py-10 text-center">
        <p className="font-display text-[1.5rem] font-extrabold leading-tight text-ink mb-3">
          {value?.heading}
        </p>
        {value?.text ? (
          <p className="text-[0.95rem] text-ink-mid max-w-[420px] mx-auto mb-6">
            {value.text}
          </p>
        ) : null}
        <Link
          href={value?.buttonHref ?? '/contact'}
          className="px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] transition-all inline-flex items-center gap-2"
        >
          {value?.buttonLabel} <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    ),
  },
}

function slugify(block: PortableTextBlock) {
  const children = (block?.children ?? []) as { text?: string }[]
  const text = children.map((c) => c?.text ?? '').join(' ')
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

export default function PortableBody({
  value,
}: {
  value?: PortableTextBlock[]
}) {
  if (!value?.length) return null
  return <PortableText value={value} components={components} />
}
