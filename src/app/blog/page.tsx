import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CategoryFilter from "@/components/blog/CategoryFilter";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "The Journal | Portland Mortgage Insights | The Lindley Team",
  description:
    "Mortgage education, Portland market insights, and neighborhood deep-dives. Written by Bri Lindley — Senior Loan Officer, NMLS #1367416. Real information for Portland buyers.",
};

const categories = [
  "All",
  "Divorce Lending",
  "First-Time Buyers",
  "Refinancing",
  "Traditional",
  "Current Homeowners",
];

const categoryLabels: Record<string, string> = {
  "divorce-lending": "Divorce Lending",
  "first-time-buyers": "First-Time Buyers",
  refinance: "Refinancing",
  traditional: "Traditional",
  "current-homeowners": "Current Homeowners",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  featured?: boolean;
};

export default async function BlogPage() {
  // Ordered newest-first by the GROQ query. An editor can override which post
  // sits in the hero slot with the "Feature at top of blog" toggle in Sanity.
  const sortedPosts = await sanityFetch<PostCard[]>({
    query: postsQuery,
    tags: ["posts"],
  });

  const featuredPost =
    sortedPosts.find((p) => p.featured) ?? sortedPosts[0];
  const remainingPosts = sortedPosts.filter(
    (p) => p.slug !== featuredPost?.slug
  );

  if (!featuredPost) return null;

  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className="pt-40 pb-20 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-tight mb-6">
              The<br />
              <span className="font-script font-normal text-orange text-[0.9em]">Journal</span>
            </h1>
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[580px]">
              Mortgage education, Portland market insights, and neighborhood deep-dives. Written by Bri — not a content farm.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            {/*
              CategoryFilter is a "use client" component — it manages active
              category state and pushes URL query params on selection.
            */}
            <Suspense
              fallback={
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="px-5 py-2.5 rounded-full border border-border text-[0.72rem] font-bold tracking-[0.06em] uppercase text-ink-mid"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              }
            >
              <CategoryFilter categories={categories} />
            </Suspense>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="bg-ink text-white rounded-2xl p-10 md:p-14 lg:p-16">
              <div className="max-w-[760px]">
                <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-[0.65rem] font-bold tracking-[0.12em] uppercase text-white/60 mb-6">
                  {categoryLabels[featuredPost.category] ?? featuredPost.category}
                </span>
                <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight mb-5">
                  {featuredPost.title}
                </h2>
                <p className="text-[1.05rem] leading-[1.8] text-white/60 font-normal mb-8 max-w-[600px]">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="text-[0.78rem] text-white/40 font-normal">
                    Bri Lindley &nbsp;·&nbsp; {formatDate(featuredPost.date)}
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="px-8 py-4 border border-white/40 text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:bg-white hover:text-ink transition-all inline-flex items-center gap-2"
                  >
                    Read Article <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group border border-border rounded-2xl p-7 flex flex-col hover:border-ink/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-ink-light">
                      {categoryLabels[post.category] ?? post.category}
                    </span>
                    <span className="text-[0.62rem] text-ink-light font-normal">
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <h3 className="font-display text-[1.05rem] font-bold leading-snug text-ink mb-3 flex-1 group-hover:text-orange transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[0.88rem] text-ink-mid font-normal leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <div className="text-[0.72rem] font-bold tracking-[0.04em] uppercase text-ink-light border-t border-border pt-4 group-hover:text-ink transition-colors">
                    Read Article →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / Subscribe CTA */}
        <section className="py-20 bg-yellow">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Stay Informed
              </p>
              <div className="max-w-[540px]">
                <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight text-ink mb-3">
                  Get Portland mortgage insights in your inbox.
                </h2>
                <p className="text-base text-ink-mid font-normal leading-relaxed mb-7">
                  No spam. No fluff. Just useful information when it matters.
                </p>
                {/* GHL Form Integration — replace this placeholder with GHL embed */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    disabled
                    className="flex-1 px-5 py-3.5 rounded-full border border-ink/20 bg-white/60 text-[0.88rem] text-ink placeholder:text-ink-light focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <button
                    disabled
                    className="px-8 py-3.5 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-[0.72rem] text-ink-light mt-3">
                  Email form coming soon — in the meantime, reach us at{" "}
                  <a
                    href="mailto:bri@thelindleyteam.com"
                    className="underline hover:text-ink transition-colors"
                  >
                    bri@thelindleyteam.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-ink text-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-4">
              Have a mortgage{" "}
              <span className="font-script font-normal text-orange text-[0.9em]">
                question?
              </span>
            </h2>
            <p className="text-base text-white/60 font-normal max-w-[440px] mx-auto mb-8">
              We write about what our clients actually ask. Send your question and we might feature it.
            </p>
            <Link
              href="/contact"
              className="px-8 py-4 border-[1.5px] border-white text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:bg-white hover:text-ink transition-all inline-flex items-center gap-2"
            >
              Ask a Question <span>→</span>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
