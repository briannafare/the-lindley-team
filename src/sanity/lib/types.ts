import type { PortableTextBlock } from '@portabletext/react'
import type { Image } from 'sanity'

export type SanityImage = Image & {
  alt?: string
  caption?: string
}

export type Author = {
  name: string
  title?: string
  credentials?: string
  bio?: string
  headshot?: SanityImage
}

export type Faq = {
  question: string
  answer: string
}

export type Seo = {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  canonicalUrl?: string
  noIndex?: boolean
}

/**
 * Shape returned by the `postCard` projection. `date` and `category` are
 * deliberately flattened to match the legacy BlogPost interface so the
 * existing page markup did not need rewriting.
 */
export type PostCard = {
  _id: string
  title: string
  slug: string
  excerpt: string
  date: string
  category: string
  categoryLabel?: string
  categoryColor?: string
  featured?: boolean
  heroImage?: SanityImage
}

export type Post = PostCard & {
  updatedAt?: string
  body?: PortableTextBlock[]
  faqs?: Faq[]
  seo?: Seo
  author?: Author
  related?: PostCard[]
}

/** Payload projected by the Sanity publish webhook. */
export type RevalidatePayload = {
  _type: string
  slug?: string
}
