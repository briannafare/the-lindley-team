import Btn from "@/components/Btn";
import HeroPathways from "@/components/HeroPathways";
import { GOOGLE_REVIEWS } from "@/lib/links";

export default function Hero() {
  return (
    <section className="bg-paper pt-[clamp(18px,3.5vh,44px)] pb-[clamp(64px,9vw,120px)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        {/* GALLERY POSTER. One editorial system across breakpoints: the serif
            headline is the star, the photo is a matted print floating on a flat
            lime block (the collage/Met signature), set in intentional negative
            space. Desktop: type sweeps wide-left, the print anchors lower-right,
            pitch + CTAs beneath the type. Mobile: the same three parts reflow —
            kicker+headline, the print, then pitch + CTAs — sized so the buttons
            stay on-screen. No text over the photo (Met keeps type on white). */}
        <div className="grid lg:grid-cols-12 lg:gap-x-10 lg:items-start">
          {/* HEADLINE + kicker — the star */}
          <div className="lg:col-start-1 lg:col-end-9 lg:row-start-1">
            <div className="mb-3 flex items-center gap-3 lg:mb-6">
              <span className="h-px w-9 bg-ink/40" aria-hidden />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-light">
                Portland mortgage lenders
              </span>
            </div>
            <h1 className="font-serif font-semibold text-ink text-[clamp(32px,5.4vw,74px)] leading-[0.96] lg:leading-[0.94] tracking-[-0.03em] pb-[0.06em]">
              <span className="hero-line block">
                Nobody{" "}
                <em className="not-italic relative inline-block">
                  <span className="font-medium italic text-orange">dreams</span>
                  <svg className="hero-underline absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden>
                    <path d="M2 9 C30 2, 90 2, 118 8" stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </em>{" "}
                about getting a mortgage.
              </span>
              <span className="hero-line block">
                You dream about <span className="font-medium italic text-orange">the home.</span>
              </span>
            </h1>
          </div>

          {/* MEDIA — matted print: photo on a flat lime block, offset like a
              collage. A contained object (not a full-bleed band) so it reads as
              a placed print on both screens. */}
          <div className="hero-media -mx-5 mt-6 lg:mx-0 lg:mt-0 lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-span-2 lg:self-center lg:pt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-lime translate-y-3 lg:translate-x-4 lg:translate-y-4" aria-hidden />
              <div className="hero-visual relative overflow-hidden aspect-[2/1] lg:aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/hero-moving-day.webp"
                  alt="Overhead shot of someone lying arms-out on the bare floor of their new living room on move-in day, boxes and a pizza box beside them"
                  width="1260"
                  height="672"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-[58%_42%] saturate-[0.96] contrast-[1.02]"
                />
              </div>
            </div>
            <p className="hero-caption hidden lg:block font-serif text-ink text-[clamp(14px,1.3vw,17px)] leading-relaxed mt-5">
              <span className="italic">&ldquo;This is the part you dream about.&rdquo;</span>
              <span className="block not-italic text-ink-light mt-1">
                We&rsquo;ll make the financing part easier. &mdash; David &amp; Bri
              </span>
            </p>
          </div>

          {/* BODY — pitch, CTAs, proof, licensing */}
          <div className="mt-5 lg:mt-8 lg:col-start-1 lg:col-end-8 lg:row-start-2">
            <p className="hero-sub max-w-[52ch] text-[clamp(16px,1.3vw,21px)] text-ink-mid leading-snug lg:leading-relaxed">
              We handle the part nobody dreams about &mdash; so the numbers are clear, the
              plan is yours, and the only surprise on closing day is how good it feels.
            </p>

            <p className="max-w-[62ch] text-[clamp(14px,1vw,16px)] text-ink-light leading-relaxed mt-4">
              David Chandler and Bri Lindley start by understanding you &mdash; your finances,
              your timeline, your long-term goals. Then we build a mortgage strategy around
              them and walk you through a{" "}
              <strong className="font-semibold text-ink">Mortgage Cost Analysis</strong>: a
              clear, side-by-side breakdown of your options, explained patiently and down to
              the decimal. No jargon. No pressure. Just the clarity to move forward with
              confidence.
            </p>

            <div className="hero-cta grid sm:flex sm:flex-wrap items-center gap-3 sm:gap-x-4 mt-5 sm:mt-7">
              <Btn href="/contact#schedule" variant="accent" size="lg" className="w-full sm:w-auto justify-between">
                Get Your Free Mortgage Cost Analysis
              </Btn>
              <Btn href="#how-it-works" variant="outline" size="lg" className="w-full sm:w-auto justify-between">
                See How It Works
              </Btn>
            </div>

            {/* Trust line — reviews, experience, licensing. */}
            <div className="hero-proof mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-body text-[13px] text-ink-light">
              <a
                href={GOOGLE_REVIEWS}
                target="_blank"
                rel="noopener noreferrer"
                className="group/rev flex items-center gap-2 hover:text-orange transition-colors"
              >
                <span className="text-orange" aria-hidden>★★★★★</span>
                <span className="font-semibold text-ink group-hover/rev:text-orange transition-colors">156</span>
                <span className="underline decoration-ink/20 underline-offset-4 group-hover/rev:decoration-orange transition-colors">
                  five-star Google reviews
                </span>
              </a>
              <span aria-hidden className="text-ink-light/50">·</span>
              <span>35 years combined experience</span>
              <span aria-hidden className="text-ink-light/50">·</span>
              <span>NMLS #265974 / #1367416</span>
            </div>
            {/* Movement's NMLS ID — required visible. */}
            <p className="font-body text-[10.5px] tracking-[0.02em] text-ink-light/70 mt-2 leading-relaxed">
              Movement Mortgage NMLS #39179 · Equal Housing Lender
            </p>
          </div>
        </div>

        <HeroPathways />
      </div>
    </section>
  );
}
