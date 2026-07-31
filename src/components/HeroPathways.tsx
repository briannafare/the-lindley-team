"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Rail from "@/components/Rail";

const SITE_URL = "https://thelindleyteam.com";
const ORG_ID = `${SITE_URL}/#lindleyteam`;

/**
 * Each card carries two layers of copy:
 *  - `desc`  the human hook — the line that gives the section its voice.
 *  - `claim` one entity-dense sentence (service names + geography) that reads
 *            like an answer, so AI engines have something quotable to cite.
 * `label` is the accessible anchor text for the arrow link; generic "learn
 * more" anchors waste a ranking and citation signal.
 */
type Pathway = {
  title: string;
  desc: string;
  claim: string;
  label: string;
  href: string;
  img: string;
  serviceType: string;
  /** Only set where a second, more-searched term should be tied to the service. */
  additionalType?: string;
  treatment: string;
  offset: string;
};

const PATHWAYS: Pathway[] = [
  {
    title: "Buy a home",
    desc: "First one, next one, or the one you'll actually stay in.",
    claim:
      "Conventional, FHA, VA, and jumbo loans for first-time and move-up buyers in Portland.",
    label: "Explore home purchase loans",
    href: "/services/purchase",
    img: "/img/home-buy.webp",
    serviceType: "Home purchase loans",
    treatment: "",
    offset: "",
  },
  {
    title: "Refinance",
    desc: "Lower the payment, pull cash out, drop the PMI.",
    claim:
      "Rate-and-term and cash-out refinancing to lower your payment or eliminate PMI.",
    label: "Explore refinancing",
    href: "/services/refinance",
    img: "/img/home-refinance.webp",
    serviceType: "Mortgage refinancing",
    treatment: "img-bw",
    offset: "lg:mt-10",
  },
  {
    title: "Divorce lending",
    desc: "Untangle the house from the divorce — cleanly.",
    claim:
      "Bri Lindley is a Certified Divorce Lending Professional (CDLP®) helping divorcing homeowners with buyouts, refinancing, and equity division.",
    label: "Explore divorce lending",
    href: "/services/divorce-lending",
    img: "/img/home-divorce.webp",
    serviceType: "Divorce lending",
    treatment: "",
    offset: "lg:mt-4",
  },
  {
    title: "Buy an investment property",
    desc: "Make the numbers work before you make the offer.",
    claim:
      "DSCR, conventional, and portfolio loans for rental properties and real estate investors in the Portland metro.",
    label: "Explore investment property loans",
    href: "/services/investment",
    // TODO(asset): needs a duplex/fourplex or "For Rent" porch photo in the same
    // muted filmic palette as cards 1–2. No such image exists in the repo yet, so
    // this borrows the Portland linocut. It's run through img-bw deliberately —
    // the divorce card is already a sepia linocut, and two matching prints side by
    // side reads as a repeat. Desaturated, the set stays a mix (colour photo, b/w
    // photo, sepia print, b/w print). Drop the treatment when the photo lands.
    img: "/img/illustration-portland.webp",
    serviceType: "Investment property loans",
    additionalType: "DSCR financing",
    treatment: "img-bw",
    offset: "lg:mt-12",
  },
];

// The CDLP® is a rare, citable credential. On the divorce service Bri is listed
// as a provider alongside the business, so an engine answering a divorce-mortgage
// question can name the person and the certification together.
const BRI_CDLP = {
  "@type": "Person",
  name: "Bri Lindley",
  jobTitle: "Mortgage Loan Officer",
  identifier: "NMLS #1367416",
  worksFor: { "@id": ORG_ID },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "certification",
    name: "Certified Divorce Lending Professional (CDLP®)",
    recognizedBy: {
      "@type": "Organization",
      name: "Divorce Lending Association",
    },
  },
};

const SERVICES_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Mortgage services — The Lindley Team, Portland Oregon",
  itemListElement: PATHWAYS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: p.title,
      serviceType: p.serviceType,
      ...(p.additionalType ? { additionalType: p.additionalType } : {}),
      description: p.claim,
      url: `${SITE_URL}${p.href}`,
      provider:
        p.serviceType === "Divorce lending"
          ? [{ "@id": ORG_ID }, BRI_CDLP]
          : { "@id": ORG_ID },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Portland Metro, Oregon" },
        { "@type": "State", name: "Oregon" },
        { "@type": "State", name: "Washington" },
      ],
    },
  })),
};

/**
 * Touch devices have no hover, so the desktop card motion (image zoom, color
 * shift) would never play. Instead, mark a card "active" while it sits in the
 * vertical center of the viewport — the hover effect becomes a scroll effect.
 * Desktop keeps real :hover (observer is disabled where hover is supported).
 * Reduced-motion users get neither.
 */
function useActiveOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const touch = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touch || reduce) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // Shrink the root to a thin band across the middle of the screen, so a
      // card counts as "in view" only while it's roughly centered.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, active };
}

function PathwayCard({ path }: { path: (typeof PATHWAYS)[number] }) {
  const { ref, active } = useActiveOnScroll<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={path.href}
      aria-label={path.label}
      data-active={active}
      className={`group block min-w-0 snap-start ${path.offset}`}
    >
      <div className="border border-ink/10 bg-paper p-2">
        <div className="aspect-[4/3] overflow-hidden bg-bg-alt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={path.img}
            alt=""
            width="1024"
            height="768"
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover saturate-[0.9] contrast-[1.03] transition-all duration-700 group-hover:scale-[1.025] group-data-[active=true]:scale-[1.025] ${path.treatment}`}
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-5 mt-6">
        <div>
          <h3 className="font-grotesk font-bold text-[clamp(20px,1.7vw,27px)] leading-none tracking-[-0.02em] transition-colors group-hover:text-orange group-data-[active=true]:text-orange">
            {path.title}
          </h3>
          <p className="text-[14px] text-ink-light leading-relaxed mt-2 max-w-[34ch]">{path.desc}</p>
          <p className="text-[13px] text-ink-mid leading-relaxed mt-2 max-w-[38ch]">{path.claim}</p>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors group-hover:bg-ink group-hover:text-paper group-data-[active=true]:bg-ink group-data-[active=true]:text-paper"
          aria-hidden
        >
          →
        </span>
      </div>
    </Link>
  );
}

/**
 * Four independent pathways — not steps. All remain visible on mobile as a
 * swipeable rail; 2-across at md, 4-across with the stagger preserved at lg.
 */
export default function HeroPathways() {
  return (
    <div className="mt-[clamp(96px,12vw,176px)] border-t border-ink pt-5 sm:pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_LD) }}
      />
      <h2 className="font-serif font-semibold text-[clamp(30px,4vw,56px)] leading-[0.98] tracking-[-0.025em]">
        Start with what you need.
      </h2>
      {/* Entity-dense lead-in: humans skim it, AI engines get brand + services
          + geography as a single extractable claim. */}
      <p className="text-[15px] text-ink-mid leading-relaxed mt-4 max-w-[70ch]">
        The Lindley Team offers home purchase loans, refinancing, divorce lending, and
        investment property financing for homeowners and investors across the Portland metro.
      </p>

      <Rail className="mobile-rail -mx-5 grid grid-flow-col auto-cols-[80%] overflow-x-auto snap-x snap-mandatory scroll-pl-5 px-5 pb-2 sm:auto-cols-[42%] md:mx-0 md:grid-flow-row md:auto-cols-auto md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:scroll-pl-0 md:px-0 md:pb-0 gap-5 lg:gap-6 mt-[clamp(40px,5vw,68px)]">
        {PATHWAYS.map((path) => (
          <PathwayCard key={path.title} path={path} />
        ))}
      </Rail>
    </div>
  );
}
