import { groq } from 'next-sanity'

/**
 * Projections deliberately mirror the shape of the old `BlogPost` interface
 * from src/lib/blog-posts.ts (`date`, `category` as a slug string) so the
 * existing page JSX did not have to be rewritten around a new data shape.
 */
const postCard = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "date": publishedAt,
  "category": category->slug.current,
  "categoryLabel": category->title,
  "categoryColor": category->color,
  featured,
  heroImage
`

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)]
  | order(publishedAt desc) { ${postCard} }
`

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${postCard},
    updatedAt,
    body,
    faqs,
    seo,
    "author": author->{name, title, credentials, bio, headshot},
    "related": *[
      _type == "post" &&
      slug.current != $slug &&
      category._ref == ^.category._ref
    ] | order(publishedAt desc)[0...3] { ${postCard} }
  }
`

export const sitemapQuery = groq`
  *[_type == "post" && defined(slug.current) && seo.noIndex != true]
  | order(publishedAt desc) {
    "slug": slug.current,
    "date": publishedAt,
    updatedAt
  }
`
