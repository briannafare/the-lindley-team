import Link from "next/link";
import { neighborhoods } from "@/lib/neighborhoods";

const FEATURED = ["sellwood-moreland", "alberta-arts", "pearl-district", "irvington", "st-johns"];

export default function ExploreNeighborhoods() {
  const tiles = FEATURED
    .map((slug, i) => {
      const n = neighborhoods.find((x) => x.slug === slug);
      if (!n) return null;
      return { ...n, no: String(i + 1).padStart(2, "0"), bw: i % 2 === 1 };
    })
    .filter(Boolean) as (typeof neighborhoods[number] & { no: string; bw: boolean })[];

  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(56px,8vw,120px)]">
      {/* section header:  Title (0X) ————— link */}
      <div className="flex items-baseline gap-3.5 border-t border-ink pt-4">
        <h2 className="font-grotesk font-extrabold text-[clamp(26px,3.4vw,46px)] leading-none tracking-[-0.02em]">
          Explore neighborhoods
        </h2>
        <sup className="font-body text-[12px] text-ink-light font-medium">(02)</sup>
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
            <div className="relative aspect-[3/4.1] overflow-hidden bg-ink">
              <span className="absolute top-2.5 left-3 z-[2] font-grotesk font-bold text-[12px] text-white">
                {t.no}
              </span>
              <span className="absolute left-3 right-3 bottom-3 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-white text-[clamp(15px,1.5vw,23px)]">
                {t.name}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/lt-${t.slug}/460/620`}
                alt={t.name}
                className={`w-full h-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-[1.05] ${t.bw ? "img-bw" : ""}`}
              />
            </div>
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
