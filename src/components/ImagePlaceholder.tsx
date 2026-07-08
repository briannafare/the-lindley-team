/**
 * Vibe-capturing image placeholder. Shows a toned, photo-shaped block with a
 * caption describing the real image that will replace it — so intent reads
 * clearly before final photography/generation exists.
 */
export default function ImagePlaceholder({
  seed,
  label,
  tone = "bw",
  className = "",
  overlayTitle,
}: {
  seed: string;
  label: string;
  tone?: "bw" | "color";
  className?: string;
  overlayTitle?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-ink/5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${seed}/1000/800`}
        alt=""
        className={`w-full h-full object-cover ${tone === "bw" ? "img-bw" : ""}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <span className="absolute top-3 left-3 z-10 font-body text-[0.58rem] tracking-[0.18em] uppercase text-white/90 bg-ink/55 backdrop-blur-sm px-2 py-1 rounded-[2px]">
        Image to come
      </span>
      {overlayTitle && (
        <span className="absolute left-5 right-5 top-1/2 -translate-y-1/2 z-10 font-serif italic text-white text-[clamp(1.5rem,3.5vw,2.75rem)] leading-tight">
          {overlayTitle}
        </span>
      )}
      <span className="absolute left-3 right-3 bottom-3 z-10 font-body text-[0.72rem] leading-snug text-white/95">
        {label}
      </span>
    </div>
  );
}
