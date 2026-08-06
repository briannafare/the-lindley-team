import { NeighborhoodData } from "@/lib/neighborhoods";

/**
 * Shared "mixed editorial imagery" vocabulary for neighborhood tiles + heroes.
 * Four Met-editorial treatments, matching the homepage ExploreNeighborhoods set:
 *   photo         — color, Kodak Portra 400 pass (warm, muted)
 *   photo-bw      — black & white, Kodak Tri-X pass (.img-bw)
 *   poster-cobalt — flat cobalt field, limewash line-art + type
 *   poster-lime   — flat limewash field, ink line-art + type
 * Neighborhoods with a real photo get photo/photo-bw; the rest get a designed
 * poster (never a random stock image). All choices are deterministic per slug.
 */

export type TileStyle = "photo" | "photo-bw" | "poster-cobalt" | "poster-lime";

/** Portra-400-ish color pass for real color photos. */
export const PORTRA = "brightness-95 contrast-[1.03] saturate-[0.92]";

function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

export function pickTileStyle(n: NeighborhoodData, index: number): TileStyle {
  const h = slugHash(n.slug) + index;
  if (n.image) {
    // ~45% of real photos run B&W (architecture/mood), rest color (life).
    return h % 20 < 9 ? "photo-bw" : "photo";
  }
  return h % 2 === 0 ? "poster-cobalt" : "poster-lime";
}

// ---------- line-art motifs (single-weight, classic strokes) ----------

type MotifProps = { stroke: string; accent: string; className?: string };

function BridgeArt({ stroke, accent, className }: MotifProps) {
  // Gothic-tower suspension bridge — St. Johns spirit.
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <path d="M8 86 H112" stroke={stroke} strokeWidth="1.5" />
      <path d="M36 86 V36 M44 86 V36 M36 36 L40 26 L44 36 M76 86 V36 M84 86 V36 M76 36 L80 26 L84 36" stroke={stroke} strokeWidth="1.5" />
      <path d="M8 60 C 22 40, 34 38, 40 38 S 60 62, 60 62 S 74 38, 80 38 S 100 46, 112 60" stroke={accent} strokeWidth="1.5" />
    </svg>
  );
}

function BungalowRowArt({ stroke, accent, className }: MotifProps) {
  // Row of Craftsman gables.
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      {[14, 52, 90].map((x) => (
        <g key={x}>
          <path d={`M${x} 84 V56 L${x + 16} 42 L${x + 32} 56 V84`} stroke={stroke} strokeWidth="1.5" />
          <rect x={x + 11} y={64} width="10" height="20" stroke={stroke} strokeWidth="1.25" />
        </g>
      ))}
      <line x1="8" y1="84" x2="112" y2="84" stroke={accent} strokeWidth="2" />
    </svg>
  );
}

function FirTreesArt({ stroke, accent, className }: MotifProps) {
  // Three PNW firs.
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      {[
        { x: 34, s: 1 },
        { x: 60, s: 1.25 },
        { x: 86, s: 1 },
      ].map(({ x, s }, i) => (
        <g key={i}>
          <path d={`M${x} ${96 - 40 * s} L${x - 14 * s} ${92} H${x + 14 * s} Z`} stroke={stroke} strokeWidth="1.5" />
          <path d={`M${x} ${88 - 40 * s} L${x - 10 * s} ${74} H${x + 10 * s} Z`} stroke={stroke} strokeWidth="1.5" />
          <line x1={x} y1="92" x2={x} y2="102" stroke={stroke} strokeWidth="1.5" />
        </g>
      ))}
      <line x1="10" y1="102" x2="110" y2="102" stroke={accent} strokeWidth="2" />
    </svg>
  );
}

function StorefrontArt({ stroke, accent, className }: MotifProps) {
  // Neighborhood storefront with awning.
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <rect x="20" y="40" width="80" height="52" stroke={stroke} strokeWidth="1.5" />
      <path d="M16 40 H104 L96 54 H24 Z" stroke={accent} strokeWidth="1.5" />
      {[28, 40, 52, 64, 76, 88].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 4} y2="54" stroke={stroke} strokeWidth="0.75" opacity="0.5" />
      ))}
      <rect x="34" y="64" width="20" height="28" stroke={stroke} strokeWidth="1.25" />
      <rect x="66" y="64" width="20" height="16" stroke={stroke} strokeWidth="1.25" />
    </svg>
  );
}

function RiverBendArt({ stroke, accent, className }: MotifProps) {
  // Willamette bend + far bank.
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <path d="M6 44 C 40 44, 44 66, 78 66 S 114 82, 114 82" stroke={stroke} strokeWidth="1.5" />
      <path d="M6 58 C 40 58, 44 80, 78 80 S 114 96, 114 96" stroke={accent} strokeWidth="1.5" />
      <path d="M6 30 C 40 30, 44 52, 78 52 S 114 68, 114 68" stroke={stroke} strokeWidth="0.9" opacity="0.55" />
    </svg>
  );
}

const MOTIFS = [BridgeArt, BungalowRowArt, FirTreesArt, StorefrontArt, RiverBendArt];

export function pickMotif(slug: string) {
  return MOTIFS[slugHash(slug) % MOTIFS.length];
}

// ---------- reusable poster surface (used by tile + editorial hero/band) ----------

/**
 * Flat colored poster with a line-art motif and the neighborhood name.
 * Fills its positioned parent (w-full h-full). `tone` selects the palette;
 * `size` scales the name for card vs. hero/band use.
 */
export function Poster({
  neighborhood: n,
  tone,
  size = "sm",
  hideName = false,
}: {
  neighborhood: NeighborhoodData;
  tone: "cobalt" | "lime" | "ink";
  size?: "sm" | "lg";
  hideName?: boolean;
}) {
  const Motif = pickMotif(n.slug);
  const palette =
    tone === "cobalt"
      ? { bg: "bg-cobalt group-hover:bg-ink", stroke: "#F0F4A6", accent: "#EF4434", name: "text-limewash" }
      : tone === "lime"
        ? { bg: "bg-limewash group-hover:bg-lime", stroke: "#0d0d0d", accent: "#EF4434", name: "text-ink" }
        : { bg: "bg-ink", stroke: "#F0F4A6", accent: "#DF6E56", name: "text-white" };
  const nameSize = size === "lg" ? "text-[clamp(24px,3.4vw,46px)]" : "text-[clamp(15px,1.5vw,23px)]";
  const motifSize = size === "lg" ? "w-[34%] max-w-[220px] h-auto" : "w-[52%] h-auto";

  return (
    <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${palette.bg}`}>
      <Motif stroke={palette.stroke} accent={palette.accent} className={motifSize} />
      {!hideName && (
        <span
          className={`absolute left-4 right-4 bottom-4 z-[2] font-grotesk font-extrabold uppercase leading-[0.98] tracking-[-0.01em] ${palette.name} ${nameSize}`}
        >
          {n.name}
        </span>
      )}
    </div>
  );
}
