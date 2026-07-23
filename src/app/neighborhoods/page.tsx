import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NeighborhoodBrowser from "@/components/neighborhoods/NeighborhoodBrowser";
import { neighborhoods } from "@/lib/neighborhoods";

export const metadata: Metadata = {
  title: "Portland Neighborhoods | The Lindley Team",
  description:
    "Your Portland mortgage lender should know these streets as well as you do. Browse neighborhood guides for home prices, schools, commute times, and local life — then talk to Bri.",
};

export default function NeighborhoodsPage() {
  return (
    <>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-6">
            Portland, OR &amp; Southwest Washington
          </p>
          <h1 className="font-serif text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.03em] mb-6 max-w-[800px]">
            {neighborhoods.length} Portland neighborhoods. One&apos;s{" "}
            <em className="italic font-medium text-orange">yours.</em>
          </h1>
          <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[580px] mb-8">
            Your mortgage lender should know these streets as well as you do.
            Bri&apos;s been financing Portland homes since 2003; David brings
            another 20-plus years to the table. Between them, there&apos;s not
            a block in this city they haven&apos;t walked.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/apply"
              className="px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] hover:shadow-xl transition-all inline-flex items-center gap-2 justify-center"
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

      {/* ── Neighborhood Browser ──────────────────────────────────── */}
      <NeighborhoodBrowser neighborhoods={neighborhoods} />

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-yellow text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight text-ink mb-4">
            Don&apos;t see your neighborhood{" "}
            <span className="font-script font-normal text-[0.9em]">yet?</span>
          </h2>
          <p className="text-base text-ink-mid font-normal max-w-[440px] mx-auto mb-8">
            Call Bri directly. She knows Portland, and she&apos;ll help you
            understand the market wherever you&apos;re looking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:9717541771"
              className="px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] transition-all inline-flex items-center gap-2 justify-center"
            >
              Call 971-754-1771 <span>→</span>
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border-[1.5px] border-ink text-ink rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:bg-ink hover:text-white transition-all inline-flex items-center gap-2 justify-center"
            >
              Send a Message <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
