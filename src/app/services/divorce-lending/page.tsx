import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import { JsonLd, PROSE, schemaFor, flagConfirms } from "@/components/article/AiSearchArticle";
import { getServiceBySlug } from "@/lib/services";
import { getAiPage } from "@/lib/ai-search-pages";

// The existing service-page layout (hero, calculator, Service schema) stays. The answer-first copy
// lives in content/ai-search/divorce-lending-rewrite.md and is placed inside it; its FAQ replaces
// the old FAQ list, so the page's FAQPage schema and the visible accordion stay in step.
const base = getServiceBySlug("divorce-lending")!;
const page = getAiPage("service", "divorce-lending")!;
const service = { ...base, faqs: page.faqs };

export const metadata: Metadata = {
  title: base.seo.title,
  description: base.seo.description,
  keywords: base.seo.keywords,
  alternates: { canonical: "/services/divorce-lending" },
};

function Block({ html, tone }: { html: string; tone?: "alt" }) {
  return (
    <section className={`py-16 border-t border-border ${tone === "alt" ? "bg-bg-alt" : ""}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          <div />
          <div
            className={`max-w-[760px] overflow-x-auto ${PROSE}`}
            dangerouslySetInnerHTML={{ __html: flagConfirms(html) }}
          />
        </div>
      </div>
    </section>
  );
}

export default function ServicePage() {
  return (
    <>
      <JsonLd data={schemaFor(page, { articleOnly: true })} />
      <Nav />
      <ServicePageLayout
        service={service}
        calculator={<MortgageCalculator variant="compact" />}
        afterHero={<Block html={page.topHtml} />}
        beforeCta={<Block html={page.afterFaqHtml} />}
      />
      <Footer />
    </>
  );
}
