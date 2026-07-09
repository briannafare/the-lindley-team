import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Apply — David & Bri · The Lindley Team",
  description:
    "Start your mortgage application with David Chandler or Bri Lindley at Movement Mortgage.",
};

// ── Application links (swap here when the new ones arrive) ──────────────────
// NOTE (2026-07-09): Bri said the application link has CHANGED — replace the URLs
// below when she sends the new one(s). David's prior link kept as fallback; Bri's
// still routes to /contact until her Movement easyapp link is provided.
const DAVID_APPLY = "https://easyapp.movement.com/apply/create_profile?userid=10107026";
const BRI_APPLY = "https://easyapp.movement.com/apply/login?userid=10115700";

export default function ApplyPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper pt-[clamp(24px,5vh,56px)] pb-[clamp(56px,8vw,120px)]">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-[54px]">
          <p className="font-body text-[0.7rem] tracking-[0.14em] uppercase text-ink-light mb-5">
            Start your application
          </p>
          <h1 className="font-serif font-semibold text-[clamp(40px,8vw,110px)] leading-[0.9] tracking-[-0.03em]">
            Apply with <em className="italic font-medium text-orange">us.</em>
          </h1>
          <p className="max-w-[48ch] text-[clamp(15px,1.15vw,17px)] text-ink-mid leading-relaxed mt-6">
            Pick whoever you&rsquo;ve been talking to — David or Bri. Both applications run
            through Movement Mortgage, secure and about 15 minutes.
          </p>

          <div className="grid md:grid-cols-2 gap-[clamp(14px,1.6vw,24px)] mt-12">
            {/* Bri (primary / default) */}
            <div className="border border-border rounded-[3px] p-8 flex flex-col">
              <div className="font-grotesk font-extrabold text-[13px] text-orange">01</div>
              <h2 className="font-grotesk font-bold text-[clamp(22px,2.4vw,30px)] mt-2">Bri Lindley</h2>
              <p className="font-body text-[0.72rem] tracking-[0.1em] uppercase text-ink-light mt-1">
                Movement Mortgage · NMLS #1367416
              </p>
              <p className="text-[0.95rem] text-ink-mid leading-relaxed mt-4 flex-1">
                Senior Loan Officer &amp; Certified Divorce Lending Professional. Licensed in OR &amp; WA.
              </p>
              <a
                href={BRI_APPLY || "/contact"}
                {...(BRI_APPLY ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-6 inline-block bg-ink text-paper font-grotesk font-bold text-[15px] px-6 py-3.5 rounded-[2px] text-center hover:bg-orange transition-colors"
              >
                {BRI_APPLY ? "Apply with Bri" : "Start with Bri"}
              </a>
            </div>

            {/* David */}
            <div className="border border-border rounded-[3px] p-8 flex flex-col">
              <div className="font-grotesk font-extrabold text-[13px] text-orange">02</div>
              <h2 className="font-grotesk font-bold text-[clamp(22px,2.4vw,30px)] mt-2">David Chandler</h2>
              <p className="font-body text-[0.72rem] tracking-[0.1em] uppercase text-ink-light mt-1">
                Movement Mortgage · NMLS #265974
              </p>
              <p className="text-[0.95rem] text-ink-mid leading-relaxed mt-4 flex-1">
                Licensed in AZ, CA, GA, OR &amp; WA. Purchases, refinances, and everything in between.
              </p>
              <a
                href={DAVID_APPLY}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block border border-ink text-ink font-grotesk font-bold text-[15px] px-6 py-3.5 rounded-[2px] text-center hover:bg-ink hover:text-paper transition-colors"
              >
                Apply with David
              </a>
            </div>
          </div>

          <p className="text-[0.8rem] text-ink-light mt-8">
            Not sure who to pick? <Link href="/contact" className="underline hover:text-orange">Reach out</Link> and we&rsquo;ll point you the right way.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
