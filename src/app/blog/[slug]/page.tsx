import { marked } from "marked";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  blogPosts,
  getBlogPostBySlug,
  getBlogPostsByCategory,
} from "@/lib/blog-posts";

/* ── Static params ────────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const canonical = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: ["Bri Lindley", "David Chandler"],
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
  "divorce-lending": "bg-[#ff2f001a] text-orange",
  "first-time-buyers": "bg-blue/10 text-blue",
  refinance: "bg-yellow text-ink",
  traditional: "bg-bg-alt text-ink-mid",
  "current-homeowners": "bg-blue/10 text-blue",
};

/* ── Structured data components ───────────────────────────────────────────── */

function ArticleSchema({ post }: { post: NonNullable<ReturnType<typeof getBlogPostBySlug>> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Bri Lindley",
      identifier: "NMLS #1367416",
    },
    publisher: {
      "@type": "Organization",
      name: "The Lindley Team",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbSchema({ post }: { post: NonNullable<ReturnType<typeof getBlogPostBySlug>> }) {
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

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const htmlContent = await marked.parse(post.content);

  const related = getBlogPostsByCategory(post.category)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const badgeClass = categoryColors[post.category] ?? "bg-bg-alt text-ink-mid";
  const categoryLabel = categoryLabels[post.category] ?? post.category;

  return (
    <>
      <ArticleSchema post={post} />
      <BreadcrumbSchema post={post} />

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
            <h1 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[0.95] tracking-tight max-w-[860px] mb-6">
              {post.title}
            </h1>

            {/* Author + date */}
            <p className="text-[0.78rem] font-medium text-ink-light uppercase tracking-[0.06em] mb-5">
              Bri Lindley&nbsp;&nbsp;·&nbsp;&nbsp;Senior Loan Officer, NMLS #1367416&nbsp;&nbsp;·&nbsp;&nbsp;{formatDate(post.date)}
            </p>

            {/* Excerpt as subtitle */}
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[660px]">
              {post.excerpt}
            </p>

          </div>
        </section>

        {/* ── Article content ───────────────────────────────────────────────── */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">

              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Article
              </p>

              <div
                className="max-w-[720px] [&>p]:mb-6 [&>p]:text-ink-mid [&>p]:leading-[1.8] [&>p]:text-[1.05rem] [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-ink-mid [&>ul>li]:leading-relaxed [&>ol]:mb-6 [&>ol>li]:mb-2"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

            </div>
          </div>
        </section>

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

                <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                  Related
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((relPost) => {
                    const relBadge =
                      categoryColors[relPost.category] ?? "bg-bg-alt text-ink-mid";
                    const relLabel = categoryLabels[relPost.category] ?? relPost.category;
                    return (
                      <Link
                        key={relPost.slug}
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
