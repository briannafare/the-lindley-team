import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Btn from "@/components/Btn";

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
        <div className="max-w-[1180px] mx-auto px-5 lg:px-[54px]">
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

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-[clamp(64px,8vw,112px)]">
            {/* David */}
            <div className="group overflow-hidden rounded-[1.5rem] border border-border bg-paper shadow-[0_24px_70px_rgba(0,0,0,0.05)]">
              <div className="relative aspect-[16/10] overflow-hidden bg-bg-alt">
                <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-ink" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team/david-serious.webp"
                  alt="David Chandler"
                  width="1024"
                  height="1024"
                  className="h-full w-full object-cover object-[center_22%] grayscale transition-all duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col">
                <h2 className="font-serif text-[clamp(28px,3vw,40px)] leading-none">David Chandler</h2>
                <p className="font-body text-[0.72rem] tracking-[0.1em] uppercase text-ink-light mt-2">
                  Movement Mortgage · NMLS #265974
                </p>
                <p className="text-[0.95rem] text-ink-mid leading-relaxed mt-5 flex-1">
                  Licensed in OR, WA &amp; AZ. Purchases, refinances, and everything in between.
                </p>
                <div className="mt-7">
                  <Btn href={DAVID_APPLY} external variant="primary" size="lg" className="w-full justify-between sm:w-auto">
                    Apply with David
                  </Btn>
                </div>
              </div>
            </div>

            {/* Bri */}
            <div className="group overflow-hidden rounded-[1.5rem] border border-border bg-paper shadow-[0_24px_70px_rgba(0,0,0,0.05)]">
              <div className="relative aspect-[16/10] overflow-hidden bg-bg-alt">
                <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-ink" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team/bri-serious.webp"
                  alt="Bri Lindley"
                  width="800"
                  height="1280"
                  className="h-full w-full object-cover object-[center_18%] grayscale transition-all duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col">
                <h2 className="font-serif text-[clamp(28px,3vw,40px)] leading-none">Bri Lindley</h2>
                <p className="font-body text-[0.72rem] tracking-[0.1em] uppercase text-ink-light mt-2">
                  Movement Mortgage · NMLS #1367416
                </p>
                <p className="text-[0.95rem] text-ink-mid leading-relaxed mt-5 flex-1">
                  Mortgage Loan Officer &amp; Certified Divorce Lending Professional. Licensed in OR &amp; WA.
                </p>
                <div className="mt-7">
                  <Btn href={BRI_APPLY || "/contact"} external={Boolean(BRI_APPLY)} variant="outline" size="lg" className="w-full justify-between sm:w-auto">
                    {BRI_APPLY ? "Apply with Bri" : "Start with Bri"}
                  </Btn>
                </div>
              </div>
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
