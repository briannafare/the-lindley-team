import Link from "next/link";
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
    .map((slug, i) => {
      const n = neighborhoods.find((x) => x.slug === slug);
      if (!n) return null;
      return { ...n, no: String(i + 1).padStart(2, "0"), style: TILE_STYLE[slug] ?? "photo" };
    })
    .filter(Boolean) as (typeof neighborhoods[number] & { no: string; style: string })[];

  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(56px,8vw,120px)]">
      {/* section header:  Title (0X) ————— link */}
      <div className="flex items-baseline gap-3.5 border-t border-ink pt-4">
        <h2 className="font-grotesk font-extrabold text-[clamp(26px,3.4vw,46px)] leading-none tracking-[-0.02em]">
          Explore neighborhoods
        </h2>
        <sup className="font-body text-[12px] text-cobalt font-semibold">(03)</sup>
        <span className="flex-1" />
        <Link
          href="/neighborhoods"
          className="font-body text-[12px] tracking-[0.1em] uppercase font-semibold flex items-center gap-1.5 hover:text-orange transition-colors"
        >
          All 89 <span className="w-1.5 h-1.5 rounded-full bg-orange inline-block" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-[clamp(10px,1.2vw,18px)] mt-6">
        {tiles.map((t) => (
          <Link key={t.slug} href={`/neighborhoods/${t.slug}`} className="group block">
            {t.style === "poster-cobalt" ? (
              /* Flat cobalt poster — limewash type + line art */
              <div className="relative aspect-[3/4.1] overflow-hidden bg-cobalt flex items-center justify-center transition-colors duration-300 group-hover:bg-ink">
                <span className="absolute top-2.5 left-3 z-[2] font-grotesk font-bold text-[12px] text-limewash">
                  {t.no}
                </span>
                <PearlArt />
                <span className="absolute left-3 right-3 bottom-3 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-limewash text-[clamp(15px,1.5vw,23px)]">
                  {t.name}
                </span>
              </div>
            ) : t.style === "poster-lime" ? (
              /* Flat limewash poster — ink type + red-line bridge */
              <div className="relative aspect-[3/4.1] overflow-hidden bg-limewash flex items-center justify-center transition-colors duration-300 group-hover:bg-lime">
                <span className="absolute top-2.5 left-3 z-[2] font-grotesk font-bold text-[12px] text-ink">
                  {t.no}
                </span>
                <StJohnsArt />
                <span className="absolute left-3 right-3 bottom-3 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-ink text-[clamp(15px,1.5vw,23px)]">
                  {t.name}
                </span>
              </div>
            ) : (
              /* Photo tile — color, or B&W ⇄ color on hover */
              <div className="relative aspect-[3/4.1] overflow-hidden bg-ink">
                <span className="absolute top-2.5 left-3 z-[2] font-grotesk font-bold text-[12px] text-white">
                  {t.no}
                </span>
                <span className="absolute left-3 right-3 bottom-3 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-white text-[clamp(15px,1.5vw,23px)]">
                  {t.name}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CURATED[t.slug] || `https://picsum.photos/seed/lt-${t.slug}/460/620`}
                  alt={t.name}
                  className={`w-full h-full object-cover brightness-90 transition-all duration-500 group-hover:scale-[1.05] ${t.style === "photo-bw" ? "img-bw" : ""}`}
                />
              </div>
            )}
            <div className="flex justify-between mt-2.5 font-body text-[0.7rem] tracking-[0.12em] uppercase text-ink-light">
              <span>{t.city}, {t.state}</span>
              <span>Walk {t.walkScore}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
