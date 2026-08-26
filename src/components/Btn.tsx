import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Signature button — pill with an arrow chip that launches ↗ on hover.
 * Replaces the old square rounded-[2px] buttons everywhere.
 *
 * variants:
 *  primary  — ink pill, orange chip   (main money CTA on light bg)
 *  accent   — orange pill, ink chip   (loudest — use once per view)
 *  outline  — hairline pill on light bg
 *  paper    — paper pill for dark (ink) sections
 */
const VARIANTS = {
  primary: {
    pill: "bg-ink text-paper hover:bg-orange",
    chip: "bg-orange text-paper group-hover/btn:bg-paper group-hover/btn:text-ink",
  },
  accent: {
    pill: "bg-orange text-paper hover:bg-ink",
    chip: "bg-paper/20 text-paper group-hover/btn:bg-orange group-hover/btn:text-paper",
  },
  outline: {
    pill: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper",
    chip: "bg-ink/[0.08] text-ink group-hover/btn:bg-orange group-hover/btn:text-paper",
  },
  paper: {
    pill: "bg-paper text-ink hover:bg-orange hover:text-paper",
    chip: "bg-orange text-paper group-hover/btn:bg-paper group-hover/btn:text-ink",
  },
} as const;

const SIZES = {
  sm: { pill: "text-[0.6rem] tracking-[0.1em] gap-2 pl-3.5 pr-1 py-1", chip: "w-6 h-6" },
  // md grows again at lg+ — used for the nav's primary CTA so it reads
  // bigger on desktop without crowding the mobile nav row.
  md: { pill: "text-[0.72rem] tracking-[0.1em] gap-2.5 pl-5 pr-1.5 py-1.5 lg:text-[0.8rem] lg:gap-3 lg:pl-6 lg:pr-2 lg:py-2", chip: "w-8 h-8 lg:w-9 lg:h-9" },
  lg: { pill: "text-[0.8rem] tracking-[0.1em] gap-3 pl-6 pr-2 py-2", chip: "w-9 h-9" },
} as const;

export default function Btn({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  onClick?: () => void;
  external?: boolean;
}) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const cls = `group/btn inline-flex items-center max-w-full rounded-full font-body font-bold uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${s.pill} ${v.pill} ${className}`;
  const inner = (
    <>
      <span className="whitespace-normal sm:whitespace-nowrap">{children}</span>
      <span
        className={`flex items-center justify-center rounded-full shrink-0 transition-colors duration-300 ${s.chip} ${v.chip}`}
        aria-hidden
      >
        <svg
          viewBox="0 0 16 16"
          className="w-[38%] h-[38%] transition-transform duration-300 group-hover/btn:-rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 8 H14 M9 3 L14 8 L9 13" />
        </svg>
      </span>
    </>
  );
  if (external) {
    return (
      <a href={href} onClick={onClick} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={cls}>
      {inner}
    </Link>
  );
}
