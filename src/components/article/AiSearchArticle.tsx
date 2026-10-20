import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BASE, type AiPage } from "@/lib/ai-search-pages";

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Everything in the schema comes from text that is visible on the page.
function schemaFor(p: AiPage) {
  const url = `${BASE}${p.path}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: p.h1,
      description: p.description,
      datePublished: p.updated,
      dateModified: p.updated,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: p.authors.map((name) => ({ "@type": "Person", name })),
      publisher: { "@type": "Organization", name: "The Lindley Team at Movement Mortgage", "@id": `${BASE}/#lindleyteam` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Services", item: `${BASE}/services` },
        { "@type": "ListItem", position: 3, name: p.h1, item: url },
      ],
    },
  ];
  if (p.kind === "service") {
    graph.push({
      "@type": "Service",
      name: p.h1,
      description: p.description,
      url,
      provider: { "@type": "Organization", name: "The Lindley Team at Movement Mortgage", "@id": `${BASE}/#lindleyteam` },
      areaServed: [
        { "@type": "State", name: "Oregon" },
        { "@type": "State", name: "Washington" },
      ],
    });
  }
  if (p.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: p.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

// Open items stay visible on the page so nobody ships one by accident.
function flagConfirms(html: string) {
  return html.replace(
    /\[CONFIRM[^\]]*\]/g,
    (m) => `<mark class="bg-yellow/60 text-ink px-1 rounded">${m}</mark>`
  );
}

const PROSE = [
  "[&_p]:mb-6 [&_p]:text-ink-mid [&_p]:leading-[1.8] [&_p]:text-[1.05rem]",
  "[&_h2]:font-display [&_h2]:text-[clamp(1.5rem,3vw,2rem)] [&_h2]:font-extrabold [&_h2]:leading-tight [&_h2]:text-ink [&_h2]:mt-14 [&_h2]:mb-4",
  "[&_h3]:font-display [&_h3]:text-[1.15rem] [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-10 [&_h3]:mb-3",
  "[&_ul]:mb-6 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-orange [&_ul]:space-y-2",
  "[&_ol]:mb-6 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2",
  "[&_li]:text-ink-mid [&_li]:leading-[1.75] [&_li]:text-[1.05rem]",
  "[&_strong]:font-bold [&_strong]:text-ink",
  "[&_a]:text-ink [&_a]:underline [&_a]:decoration-orange [&_a]:decoration-2 [&_a]:underline-offset-[3px] hover:[&_a]:text-orange",
  "[&_table]:w-full [&_table]:text-left [&_table]:text-[0.92rem] [&_table]:border-collapse",
  "[&_th]:p-3 [&_th]:font-bold [&_th]:text-ink [&_th]:border-b [&_th]:border-border [&_th]:align-bottom",
  "[&_td]:p-3 [&_td]:text-ink-mid [&_td]:border-b [&_td]:border-border [&_td]:align-top",
  "[&_blockquote]:mt-10 [&_blockquote]:pt-6 [&_blockquote]:border-t [&_blockquote]:border-border [&_blockquote_p]:text-[0.78rem] [&_blockquote_p]:leading-relaxed",
].join(" ");

export default function AiSearchArticle({ page }: { page: AiPage }) {
  return (
    <>
      <JsonLd data={schemaFor(page)} />
      <Nav />
      <main>
        <section className="pt-40 pb-12">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Link
              href="/services"
              className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-6 inline-flex items-center gap-2 hover:text-ink transition-colors"
            >
              ← Services
            </Link>
            <h1 className="font-serif text-[clamp(2.2rem,4.6vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.03em] max-w-[900px] mt-4">
              {page.h1}
            </h1>
          </div>
        </section>
        <section className="pb-20 border-t border-border pt-12">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div
              className={`max-w-[760px] overflow-x-auto ${PROSE}`}
              dangerouslySetInnerHTML={{ __html: flagConfirms(page.html) }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
