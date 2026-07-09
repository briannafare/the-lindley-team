import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "The Lindley Team — David & Bri · Portland Mortgage",
  description:
    "David & Bri read Portland by the neighborhood, then handle the loan that lands you there. Movement Mortgage. Licensed in OR & WA.",
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
        {/* Card frame (House of Van Schneider): the whole site lives in one rounded
            card on a neutral shell — width-capped so it never floats on huge screens. */}
        <div className="relative mx-auto w-full max-w-[1728px] min-h-[calc(100vh-2rem)] bg-paper rounded-[18px] sm:rounded-[26px] overflow-clip">
          {/* Red brand spine — left edge of the card, carries the Movement lockup on every page */}
          <div
            aria-hidden
            className="hidden xl:flex absolute left-0 top-0 bottom-0 w-[44px] bg-orange text-paper z-[60] flex-col items-center justify-between py-7 select-none rounded-l-[18px] sm:rounded-l-[26px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-icon.png"
              alt=""
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

          <div className="xl:pl-[44px]">{children}</div>
        </div>

        {/* GHL chat widget page-context injector — must run BEFORE the widget script */}
        <Script
          id="ghl-page-context"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  'use strict';
  var PAGE_RULES=[
    {pattern:/divorce|cdlp|separation/i,type:'DIVORCE'},
    {pattern:/calculator/i,type:'CALCULATOR'},
    {pattern:/blog|post|article|news/i,type:'BLOG'},
    {pattern:/contact|reach-us|get-in-touch/i,type:'CONTACT'},
    {pattern:/neighborhood|area|community|portland/i,type:'NEIGHBORHOOD'},
    {pattern:/refinanc|purchase|va-loan|fha|jumbo|down-payment|pre-approv|heloc|service|loan/i,type:'SERVICE'},
    {pattern:/^\\/?(index\\.html?)?$/i,useFullPath:true,type:'HOMEPAGE'}
  ];
  function detectPageType(){
    var path=window.location.pathname;
    for(var i=0;i<PAGE_RULES.length;i++){
      var rule=PAGE_RULES[i];
      var subject=rule.useFullPath?path:window.location.href;
      if(rule.pattern.test(subject))return rule.type;
    }
    return 'GENERAL';
  }
  function injectPageContext(){
    var widget=document.querySelector('chat-widget');
    if(!widget)return;
    var pageType=detectPageType();
    var contextTag='[PAGE_CONTEXT:'+pageType+'] url:'+window.location.href;
    widget.setAttribute('prompt',contextTag);
    widget.setAttribute('data-page-type',pageType);
  }
  injectPageContext();
  window.addEventListener('chatWidgetLoaded',injectPageContext);
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',injectPageContext);
  }
})();`,
          }}
        />

        {/* GHL chat widget embed — paste the <script> tag from GHL here */}
      </body>
    </html>
  );
}
