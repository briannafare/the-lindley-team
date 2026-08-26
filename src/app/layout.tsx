import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import JuneWidget from "@/components/JuneWidget";
import ScrollActiveController from "@/components/ScrollActiveController";

// Serif display + italic swash accent (the "Museum of Art" move)
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

// Body / UI neo-grotesque (stands in for Aileron; pairs under Cabinet Grotesk)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://thelindleyteam.com";
const SITE_TITLE = "The Lindley Team at Movement Mortgage — David & Bri · Portland";
const SITE_DESC =
  "Portland mortgages with straight answers: David Chandler & Bri Lindley of The Lindley Team at Movement Mortgage. 35 years combined, 156 five-star reviews. Licensed in OR & WA. NMLS 265974 / 1367416.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | The Lindley Team",
  },
  description: SITE_DESC,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "The Lindley Team at Movement Mortgage",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
};

// Site-wide business + people structured data (LocalBusiness/MortgageBroker + Persons)
const ORG_LD = {
  "@context": "https://schema.org",
  "@type": ["FinancialService", "MortgageBroker"],
  "@id": `${SITE_URL}/#lindleyteam`,
  name: "The Lindley Team at Movement Mortgage",
  url: SITE_URL,
  telephone: "+1-971-754-1771",
  email: "brianna.lindley@movement.com",
  parentOrganization: {
    "@type": "Organization",
    name: "Movement Mortgage, LLC",
    identifier: "NMLS #39179",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "10135 SE Sunnyside Rd, Ste 125",
    addressLocality: "Clackamas",
    addressRegion: "OR",
    postalCode: "97015",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Portland Metro, Oregon" },
    { "@type": "State", name: "Oregon" },
    { "@type": "State", name: "Washington" },
  ],
  sameAs: [
    "https://www.google.com/maps/place/The+Lindley+Team,+Mortgage+Lenders/@45.4103477,-122.7485929,17z",
  ],
  employee: [
    {
      "@type": "Person",
      name: "Bri Lindley",
      jobTitle: "Mortgage Loan Officer, CDLP",
      identifier: "NMLS #1367416",
    },
    {
      "@type": "Person",
      name: "David Chandler",
      jobTitle: "Mortgage Loan Officer",
      identifier: "NMLS #265974",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {/* Cabinet Grotesk — headers/UI (free, Fontshare) */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap"
        />
      </head>
      <body className="bg-shell text-ink font-body antialiased overflow-x-hidden p-2 sm:p-3 lg:p-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }}
        />
        {/* Card frame (House of Van Schneider): the whole site lives in one rounded
            card on a neutral shell — width-capped so it never floats on huge screens.
            Capped close to the 1440px content max-width (not 1728) so the card
            doesn't balloon into a huge empty-feeling frame on large monitors. */}
        <div className="relative mx-auto w-full max-w-[1600px] min-h-[calc(100vh-2rem)] bg-paper rounded-[18px] sm:rounded-[26px] overflow-clip">
          {/* Red brand spine — left edge of the card, carries the Movement lockup on every page.
              Shows from lg (1024px) instead of xl (1280px) — xl was hiding it on a lot of
              ordinary laptop-width windows. */}
          <div
            aria-hidden
            className="hidden lg:flex absolute left-0 top-0 bottom-0 w-[44px] bg-orange text-paper z-[60] flex-col items-center justify-between py-7 select-none rounded-l-[18px] sm:rounded-l-[26px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-icon.png"
              alt=""
              width="1024"
              height="1024"
              className="w-[30px] h-[30px] rounded-full object-cover bg-paper"
            />
            <span
              style={{ writingMode: "vertical-rl" }}
              className="rotate-180 font-body text-[10px] tracking-[0.32em] uppercase whitespace-nowrap"
            >
              The Lindley Team&nbsp;&nbsp;·&nbsp;&nbsp;at Movement Mortgage
            </span>
            <span className="font-body text-[10px] tracking-[0.2em]">PDX</span>
          </div>

          <div className="lg:pl-[44px]">{children}</div>
        </div>

        {/* June — custom-branded voice + chat widget. "Talk to June" is the live GHL
            Voice AI agent ("Voice Assistant-1") over LiveKit; call/text/message capture
            through /api/lead. Replaces the stock GHL chat bubble. */}
        <JuneWidget />
        {/* On touch devices, plays hover-driven motion (e.g. B&W→color) as
            elements scroll through center — see components marked data-scroll-active. */}
        <ScrollActiveController />
      </body>
    </html>
  );
}
