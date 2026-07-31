import Link from "next/link";
import Rail from "@/components/Rail";
import { neighborhoods } from "@/lib/neighborhoods";

const FEATURED = ["sellwood-moreland", "alberta-arts", "pearl-district", "irvington", "st-johns"];

// Curated editorial imagery — rest fall back to placeholder until generated.
const CURATED: Record<string, string> = {
  "sellwood-moreland": "/img/hood-sellwood.webp",
  "alberta-arts": "/img/hood-alberta.webp",
  "pearl-district": "/img/hood-pearl.webp",
  "irvington": "/img/hood-irvington.webp",
  "st-johns": "/img/hood-stjohns.webp",
};

// Met "Explore floors" treatment: variety without noise — color photo,
// B&W photo (⇄ color on hover), and two flat poster tiles (cobalt + limewash)
// with classic line illustrations. Not every tile gets the same style.
const TILE_STYLE: Record<string, "photo" | "photo-bw" | "poster-cobalt" | "poster-lime"> = {
  "sellwood-moreland": "photo",
  "alberta-arts": "photo-bw",
  "pearl-district": "poster-cobalt",
  "irvington": "photo-bw",
  "st-johns": "poster-lime",
};

/** Simple line-art motifs — classic, single-weight strokes. */
function PearlArt() {
  // Stacked warehouse/loft windows — Pearl District
  return (
    <svg viewBox="0 0 120 120" className="w-[52%] h-auto" fill="none" aria-hidden>
      <rect x="18" y="14" width="84" height="92" stroke="#F0F4A6" strokeWidth="1.5" />
      {[30, 52, 74].map((y) =>
        [30, 54, 78].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="14" height="14" stroke="#F0F4A6" strokeWidth="1.25" />
        ))
      )}
      <line x1="18" y1="106" x2="102" y2="106" stroke="#EF4434" strokeWidth="2" />
    </svg>
  );
}

function StJohnsArt() {
  // St. Johns Bridge — gothic towers + cable arcs
  return (
    <svg viewBox="0 0 120 120" className="w-[62%] h-auto" fill="none" aria-hidden>
      <path d="M10 84 H110" stroke="#000000" strokeWidth="1.5" />
      <path d="M34 84 V38 M42 84 V38 M34 38 L38 28 L42 38 M78 84 V38 M86 84 V38 M78 38 L82 28 L86 38" stroke="#000000" strokeWidth="1.5" />
      <path d="M10 60 C 22 40, 34 38, 38 38 S 60 62, 60 62 S 78 38, 82 38 S 102 44, 110 60" stroke="#EF4434" strokeWidth="1.5" />
      <path d="M38 48 L38 84 M60 62 L60 84 M82 48 L82 84" stroke="#000000" strokeWidth="0.75" opacity="0.5" />
    </svg>
  );
}

export default function ExploreNeighborhoods() {
  const tiles = FEATURED
    .map((slug) => {
      const n = neighborhoods.find((x) => x.slug === slug);
      if (!n) return null;
      return { ...n, style: TILE_STYLE[slug] ?? "photo" };
    })
    .filter(Boolean) as (typeof neighborhoods[number] & { style: string })[];

  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(76px,9vw,148px)]">
      {/* section header:  Title (0X) ————— link */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-t border-ink pt-5">
        <h2 className="font-serif font-semibold text-[clamp(30px,3.8vw,52px)] leading-none tracking-[-0.025em]">
          Explore neighborhoods
        </h2>
        <Link
          href="/neighborhoods"
          className="shrink-0 font-body text-[14px] font-medium underline decoration-ink/20 underline-offset-4 hover:text-orange hover:decoration-orange transition-colors"
        >
          All neighborhoods →
        </Link>
      </div>

      <Rail className="mobile-rail -mx-5 grid grid-flow-col auto-cols-[46%] overflow-x-auto snap-x snap-mandatory scroll-pl-5 px-5 pb-2 md:mx-0 md:grid-flow-row md:auto-cols-auto md:grid-cols-5 md:overflow-visible md:scroll-pl-0 md:px-0 md:pb-0 gap-[clamp(10px,1.2vw,18px)] mt-6">
        {tiles.map((t) => (
          <Link key={t.slug} href={`/neighborhoods/${t.slug}`} className="group block snap-start">
            {t.style === "poster-cobalt" ? (
              /* Flat cobalt poster — limewash type + line art */
              <div className="relative aspect-[3/4.1] overflow-hidden bg-cobalt flex items-center justify-center transition-colors duration-300 group-hover:bg-ink">
                <PearlArt />
                <span className="absolute left-3 right-3 bottom-3 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-limewash text-[clamp(15px,1.5vw,23px)]">
                  {t.name}
                </span>
              </div>
            ) : t.style === "poster-lime" ? (
              /* Flat limewash poster — ink type + red-line bridge */
              <div className="relative aspect-[3/4.1] overflow-hidden bg-limewash flex items-center justify-center transition-colors duration-300 group-hover:bg-lime">
                <StJohnsArt />
                <span className="absolute left-3 right-3 bottom-3 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-ink text-[clamp(15px,1.5vw,23px)]">
                  {t.name}
                </span>
              </div>
            ) : (
              /* Photo tile — color, or B&W ⇄ color on hover */
              <div className="relative aspect-[3/4.1] overflow-hidden bg-ink">
                <span className="absolute left-3 right-3 bottom-3 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-white text-[clamp(15px,1.5vw,23px)]">
                  {t.name}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CURATED[t.slug] || `https://picsum.photos/seed/lt-${t.slug}/460/620`}
                  alt={t.name}
                  width="460"
                  height="620"
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover brightness-90 transition-all duration-500 group-hover:scale-[1.05] ${t.style === "photo-bw" ? "img-bw" : ""}`}
                />
              </div>
            )}
            <div className="flex justify-between mt-2.5 font-body text-[13px] text-ink-light">
              <span>{t.city}, {t.state}</span>
              <span>Walk {t.walkScore}</span>
            </div>
          </Link>
        ))}
      </Rail>
    </section>
  );
}
