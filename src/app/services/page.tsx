import { Metadata } from "next";
import Nav from "@/components/Nav";
import ServicesList from "@/components/ServicesList";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mortgage Loan Types Portland | Conventional, FHA, VA, Jumbo & More | The Lindley Team",
  description:
    "Every mortgage type in Portland, Oregon: conventional, FHA, VA, USDA, jumbo, new construction, bank statement (self-employed), DSCR investor, HELOC, cash-out, reverse, divorce lending, and down payment assistance. NMLS #1367416 / #265974.",
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <section className="pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4">
            Our Services
          </p>
          <h1 className="font-serif font-semibold text-[clamp(3rem,7.5vw,6rem)] leading-[0.92] tracking-[-0.02em] mb-6">
            Every mortgage product.{" "}
            <span className="italic font-medium text-orange">
              One team.
            </span>
          </h1>
          <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[640px]">
            Conventional, FHA, VA, USDA, jumbo, new construction, self-employed, investor —
            if it finances a home, it&apos;s on this shelf. Tell us your situation and we&apos;ll point
            you to the loan that fits. Usually it&apos;s the simplest one that does the job.
          </p>
        </div>
      </section>
      <ServicesList />
      <Footer />
    </>
  );
}
