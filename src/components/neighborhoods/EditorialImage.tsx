import { NeighborhoodData } from "@/lib/neighborhoods";
import { pickTileStyle, Poster, PORTRA } from "./tileStyle";

/**
 * Detail-page editorial image. Leads with a real photo when one exists (color
 * Portra for the hero, B&W Tri-X for the feeling band), otherwise a designed
 * poster in the same mixed vocabulary — never a random stock image.
 *
 *   variant "hero" — intended 4:3, color
 *   variant "band" — intended 21:9, black & white, supports an overlay title
 */
export default function EditorialImage({
  neighborhood: n,
  variant,
  className = "",
  overlayTitle,
}: {
  neighborhood: NeighborhoodData;
  variant: "hero" | "band";
  className?: string;
  overlayTitle?: string;
}) {
  const bw = variant === "band";
  // Reuse the tile style-picker so poster color is consistent per slug.
  const posterTone: "cobalt" | "lime" | "ink" = bw
    ? "ink"
    : pickTileStyle(n, 0) === "poster-lime"
      ? "lime"
      : "cobalt";

  return (
    <div className={`group relative overflow-hidden bg-ink/5 ${className}`}>
      {n.image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={n.image}
            alt={`${n.name}, Portland`}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover ${bw ? "img-bw" : PORTRA}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        </>
      ) : (
        <Poster neighborhood={n} tone={posterTone} size="lg" hideName={bw && !!overlayTitle} />
      )}

      {overlayTitle && (
        <span className="absolute left-6 right-6 top-1/2 -translate-y-1/2 z-10 font-serif italic text-white text-[clamp(1.5rem,3.5vw,2.75rem)] leading-tight drop-shadow">
          {overlayTitle}
        </span>
      )}
    </div>
  );
}
