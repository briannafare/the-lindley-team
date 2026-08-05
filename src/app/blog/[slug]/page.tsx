import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PortableBody from "@/components/blog/PortableBody";
import FaqSection from "@/components/blog/FaqSection";
import { client } from "@/sanity/lib/client";
import { imageUrl } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, postSlugsQuery } from "@/sanity/lib/queries";
import type { Post, PostCard, Faq } from "@/sanity/lib/types";

/* ── Static params ────────────────────────────────────────────────────────── */

// Every post is pre-rendered at build. New posts are added on demand by ISR,
// and the /api/revalidate webhook busts the tag the moment Sanity publishes.
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(postSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getPost(slug: string): Promise<Post | null> {
  return sanityFetch<Post | null>({
    query: postQuery,
    params: { slug },
    tags: ["posts", `post:${slug}`],
  });
}

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const canonical = post.seo?.canonicalUrl || `/blog/${post.slug}`;
  const og = post.seo?.ogImage?.asset
    ? imageUrl(post.seo.ogImage, 1200, 630)
    : post.heroImage?.asset
      ? imageUrl(post.heroImage, 1200, 630)
      : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: post.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: post.author?.name ? [post.author.name] : ["Bri Lindley"],
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: og ? [og] : undefined,
    },
  };
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const categoryLabels: Record<string, string> = {
  "divorce-lending": "Divorce Lending",
  "first-time-buyers": "First-Time Buyers",
  refinance: "Refinancing",
  traditional: "Traditional",
  "current-homeowners": "Current Homeowners",
};

const categoryColors: Record<string, string> = {
  "divorce-lending": "bg-[#ef44341a] text-orange",
  "first-time-buyers": "bg-blue/10 text-blue",
  refinance: "bg-yellow text-ink",
  traditional: "bg-bg-alt text-ink-mid",
  "current-homeowners": "bg-blue/10 text-blue",
};

/* ── Structured data components ───────────────────────────────────────────── */

function ArticleSchema({ post }: { post: Post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://thelindleyteam.com/blog/${post.slug}`,
    },
    ...(post.heroImage?.asset
      ? { image: [imageUrl(post.heroImage, 1200, 630)] }
      : {}),
    author: {
      "@type": "Person",
      name: post.author?.name ?? "Bri Lindley",
      ...(post.author?.title ? { jobTitle: post.author.title } : {}),
      identifier: post.author?.credentials ?? "NMLS #1367416",
    },
    publisher: {
      "@type": "Organization",
      name: "The Lindley Team",
      "@id": "https://thelindleyteam.com/#lindleyteam",
    },
    ...(post.categoryLabel ? { articleSection: post.categoryLabel } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbSchema({ post }: { post: Post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://thelindleyteam.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: "https://thelindleyteam.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://thelindleyteam.com/blog/${post.slug}`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function FaqSchema({ post }: { post: Post }) {
  if (!post.faqs?.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f: Faq) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const related: PostCard[] = post.related ?? [];

  const badgeClass = categoryColors[post.category] ?? "bg-bg-alt text-ink-mid";
  const categoryLabel =
    post.categoryLabel ?? categoryLabels[post.category] ?? post.category;

  return (
    <>
      <ArticleSchema post={post} />
      <BreadcrumbSchema post={post} />
      <FaqSchema post={post} />

      <Nav />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="pt-40 pb-20 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

            {/* Breadcrumb */}
            <Link
              href="/blog"
              className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-6 inline-flex items-center gap-2 hover:text-ink transition-colors"
            >
              ← Blog
            </Link>

            {/* Category badge */}
            <div className="mt-4 mb-5">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-[0.12em] uppercase ${badgeClass}`}
              >
                {categoryLabel}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.03em] max-w-[860px] mb-6">
              {post.title}
            </h1>

            {/* Author + date */}
            <p className="text-[0.78rem] font-medium text-ink-light uppercase tracking-[0.06em] mb-5">
              {post.author?.name ?? "Bri Lindley"}&nbsp;&nbsp;·&nbsp;&nbsp;
              {post.author?.title ?? "Mortgage Loan Officer"}
              {post.author?.credentials ? `, ${post.author.credentials}` : ""}
              &nbsp;&nbsp;·&nbsp;&nbsp;{formatDate(post.date)}
            </p>

            {/* Excerpt as subtitle */}
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[660px]">
              {post.excerpt}
            </p>

          </div>
        </section>

        {/* ── Hero image ────────────────────────────────────────────────────── */}
        {post.heroImage?.asset && (
          <section className="pb-4">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-bg-alt">
                <Image
                  src={imageUrl(post.heroImage, 1800)}
                  alt={post.heroImage.alt || ""}
                  fill
                  priority
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* ── Article content ───────────────────────────────────────────────── */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">

              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Article
              </h2>

              <div className="max-w-[720px]">
                <PortableBody value={post.body} />
              </div>

            </div>
          </div>
        </section>

        <FaqSection faqs={post.faqs} />

        {/* ── Author ────────────────────────────────────────────────────────── */}
        {post.author?.bio && (
          <section className="py-14 border-t border-border">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
                <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                  Written by
                </h2>
                <div className="max-w-[720px] flex gap-5 items-start">
                  {post.author.headshot?.asset && (
                    <Image
                      src={imageUrl(post.author.headshot, 160, 160)}
                      alt={post.author.headshot.alt || post.author.name}
                      width={72}
                      height={72}
                      className="rounded-full object-cover shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-display font-bold text-ink mb-1">
                      {post.author.name}
                    </p>
                    <p className="text-[0.72rem] uppercase tracking-[0.08em] text-ink-light mb-3">
                      {post.author.title}
                      {post.author.credentials
                        ? `  ·  ${post.author.credentials}`
                        : ""}
                    </p>
                    <p className="text-ink-mid leading-[1.75] text-[0.95rem]">
                      {post.author.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-yellow text-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight text-ink mb-4">
              Have{" "}
              <span className="font-script font-normal text-[0.9em]">
                questions
              </span>{" "}
              about your mortgage?
            </h2>
            <p className="text-base text-ink-mid font-normal max-w-[440px] mx-auto mb-8">
              Schedule a complimentary consultation. We&apos;ll review your situation and
              give you straight answers — no pressure, no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/apply"
                className="px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] transition-all inline-flex items-center gap-2 justify-center"
              >
                Get Pre-Approved <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-[1.5px] border-ink text-ink rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:bg-ink hover:text-white transition-all inline-flex items-center gap-2 justify-center"
              >
                Schedule a Call <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Related Posts ──────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="py-16 border-t border-border">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">

                <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                  Related
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((relPost) => {
                    const relBadge =
                      categoryColors[relPost.category] ?? "bg-bg-alt text-ink-mid";
                    const relLabel =
                      relPost.categoryLabel ??
                      categoryLabels[relPost.category] ??
                      relPost.category;
                    return (
                      <Link
                        key={relPost._id}
                        href={`/blog/${relPost.slug}`}
                        className="group border border-border rounded-2xl p-7 flex flex-col hover:border-ink/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-5">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[0.62rem] font-bold tracking-[0.1em] uppercase ${relBadge}`}
                          >
                            {relLabel}
                          </span>
                          <span className="text-[0.68rem] text-ink-light font-normal">
                            {formatDate(relPost.date)}
                          </span>
                        </div>
                        <h3 className="font-display text-[1.0rem] font-bold leading-snug text-ink mb-3 flex-1 group-hover:text-orange transition-colors">
                          {relPost.title}
                        </h3>
                        <p className="text-[0.85rem] text-ink-mid font-normal leading-relaxed mb-5 line-clamp-3">
                          {relPost.excerpt}
                        </p>
                        <div className="text-[0.72rem] font-bold tracking-[0.04em] uppercase text-ink-light border-t border-border pt-4 group-hover:text-ink transition-colors">
                          Read Article →
                        </div>
                      </Link>
                    );
                  })}
                </div>

              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
