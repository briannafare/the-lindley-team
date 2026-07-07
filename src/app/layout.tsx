import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Lindley Team — Portland Mortgage Strategy",
  description:
    "Three decades helping Portland families build wealth through real estate. Correspondent lender funding loans in-house across Oregon and Washington. NMLS #1367416.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="bg-paper text-paper-900 font-body antialiased overflow-x-hidden">
        {children}

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
        {/* Example: <Script src="https://..." strategy="afterInteractive" /> */}
      </body>
    </html>
  );
}
