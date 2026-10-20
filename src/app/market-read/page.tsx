import type { Metadata } from "next";
import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// The owned front door for the Portland Market Read email list. The form itself
// lives in GHL (form be9tK3J2ZrtgKu3KTxYZ, location pe2yBdfaVo406b3BaavZ) and is
// embedded here so the link we hand out is thelindleyteam.com/market-read
// instead of a raw api.leadconnectorhq.com widget URL.
// ponytail: plain iframe + GHL's own embed script, same pattern as BookingCalendar.

const FORM_ID = "be9tK3J2ZrtgKu3KTxYZ";

export const metadata: Metadata = {
  title: "The Portland Market Read",
  description:
    "A once-a-month read on what Portland's housing numbers did, where they came from, and how the metro figure compares to the neighborhoods underneath it.",
  alternates: { canonical: "https://thelindleyteam.com/market-read" },
  robots: { index: true, follow: true },
};

// Article schema. Dates are the page's real git history (first commit and last edit to
// this file), not invented. Bump MARKET_READ_MODIFIED each time a monthly issue/page update ships.
// Data source line: the page itself says the figures come from RMLS's monthly Portland sales report.
const MARKET_READ_PUBLISHED = "2026-09-01";
const MARKET_READ_MODIFIED = "2026-09-01";
const MARKET_READ_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Portland Market Read",
  description: metadata.description,
  datePublished: MARKET_READ_PUBLISHED,
  dateModified: MARKET_READ_MODIFIED,
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://thelindleyteam.com/market-read" },
  author: { "@type": "Organization", name: "The Lindley Team", "@id": "https://thelindleyteam.com/#lindleyteam" },
  publisher: { "@type": "Organization", name: "The Lindley Team", "@id": "https://thelindleyteam.com/#lindleyteam" },
  isBasedOn: { "@type": "Dataset", name: "RMLS monthly Portland sales figures", publisher: { "@type": "Organization", name: "RMLS" } },
  citation: "Data source: RMLS monthly Portland sales figures.",
};

export default function MarketReadPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MARKET_READ_LD) }}
      />
      <Nav />
      <main className="bg-paper pt-[clamp(24px,5vh,56px)] pb-[clamp(56px,8vw,120px)]">
        <div className="max-w-[720px] mx-auto px-5 lg:px-[54px]">
          <h1 className="font-serif font-semibold text-[clamp(36px,6vw,64px)] leading-[0.95] tracking-[-0.02em]">
            The Portland Market Read
          </h1>

          <div className="mt-8 space-y-5 text-[0.95rem] text-ink-mid leading-relaxed">
            <p>
              Once a month we write up what Portland&apos;s housing numbers did, where they
              came from so you can go check them yourself, and how the metro-wide figure
              lines up against the neighborhoods underneath it. Those two disagree more
              often than the national headlines let on. In any given month some Portland
              neighborhoods take an offer over a weekend while others sit and then cut the
              price, and a single metro average describes neither one.
            </p>
            <p>
              It goes out after RMLS publishes the previous month&apos;s Portland sales
              figures, which usually lands around the middle of the month. Tell us the
              neighborhood you&apos;re watching and that&apos;s the one we&apos;ll pull
              numbers for.
            </p>
            <p>
              One email a month. We won&apos;t put you on anything else, and if you&apos;d
              rather stop getting it, reply to any issue and we&apos;ll take you off.
            </p>
          </div>

          <div className="mt-10">
            <iframe
              src={`https://api.leadconnectorhq.com/widget/form/${FORM_ID}`}
              id={`inline-${FORM_ID}`}
              data-layout='{"id":"INLINE"}'
              data-form-id={FORM_ID}
              data-form-name="The Portland Market Read"
              data-height="560"
              data-layout-iframe-id={`inline-${FORM_ID}`}
              title="Sign up for the Portland Market Read"
              scrolling="no"
              className="w-full rounded-[1.5rem] border border-border bg-paper shadow-[0_24px_70px_rgba(0,0,0,0.06)]"
              style={{ minHeight: 560, border: 0 }}
            />
            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
