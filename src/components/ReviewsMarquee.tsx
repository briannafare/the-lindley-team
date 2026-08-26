import { GOOGLE_REVIEWS } from "@/lib/links";

// Full-bleed editorial ticker — the proof strip. Every fact here is verified
// Lindley Team equity (reviews, tenure, licensing, CDLP®), alternating
// orange ★ / cobalt ✣ marks per the Afterglow palette.
const ITEMS = [
  "156 five-star Google reviews",
  "35 years of Portland mortgages",
  "You get David or Bri — every time",
  "CDLP® divorce lending specialists",
  "Licensed in Oregon & Washington",
  "thelindleyteam.com",
];

function Run({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
      {ITEMS.map((item, i) => (
        <span key={item} className="flex items-center shrink-0">
          <span
            className={`mx-[clamp(18px,2.5vw,40px)] text-[0.9em] ${i % 2 === 0 ? "text-orange" : "text-cobalt"}`}
            aria-hidden
          >
            {i % 2 === 0 ? "★" : "✣"}
          </span>
          <span className="whitespace-nowrap">{item}</span>
        </span>
      ))}
    </span>
  );
}

export default function ReviewsMarquee() {
  return (
    <a
      href={GOOGLE_REVIEWS}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="The Lindley Team — 156 five-star Google reviews. Read them on Google."
      className="group block border-y border-ink mt-[clamp(40px,6vw,88px)] py-[clamp(12px,1.4vw,18px)] overflow-hidden bg-paper hover:bg-ink hover:text-paper transition-colors duration-300"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none font-grotesk font-bold uppercase tracking-[0.08em] text-[clamp(13px,1.2vw,17px)]">
        <Run />
        <Run hidden />
      </div>
    </a>
  );
}
