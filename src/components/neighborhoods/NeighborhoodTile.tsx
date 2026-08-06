import Link from "next/link";
import { NeighborhoodData } from "@/lib/neighborhoods";
import { pickTileStyle, Poster, PORTRA } from "./tileStyle";

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1_000).toFixed(0)}k`;
}

/**
 * Index-grid card. Mixed editorial vocabulary (see tileStyle): a real photo
 * (color Portra or B&W Tri-X) when one exists, otherwise a designed poster.
 */
export default function NeighborhoodTile({
  neighborhood: n,
  index,
}: {
  neighborhood: NeighborhoodData;
  index: number;
}) {
  const style = pickTileStyle(n, index);
  const isPoster = style === "poster-cobalt" || style === "poster-lime";

  return (
    <Link href={`/neighborhoods/${n.slug}`} className="group block snap-start">
      <div className="relative aspect-[3/4.1] overflow-hidden bg-ink rounded-[2px]">
        {isPoster ? (
          <Poster neighborhood={n} tone={style === "poster-cobalt" ? "cobalt" : "lime"} />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={n.image}
              alt={n.name}
              width="460"
              height="620"
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05] ${
                style === "photo-bw" ? "img-bw" : PORTRA
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
            <span className="absolute left-4 right-4 bottom-4 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-white text-[clamp(15px,1.5vw,23px)]">
              {n.name}
            </span>
          </>
        )}
      </div>
      <div className="flex justify-between mt-2.5 font-body text-[13px] text-ink-light">
        <span>
          {n.city}, {n.state}
        </span>
        <span className="font-medium text-ink-mid">{formatPrice(n.medianHomePrice)}</span>
      </div>
    </Link>
  );
}
