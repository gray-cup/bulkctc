import React from "react";
import type { Metadata } from "next";
import { Poppins, Inter, Instrument_Sans, Public_Sans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import RootProviders from "@/components/providers";
import { UserJotWidget } from "@/components/userjot-widget";
import Script from "next/script";
import IntercomChat from "@/components/IntercomChat";
import { Analytics } from "@vercel/analytics/next";
import { WhatsappWidget } from "@/components/whatsapp-widget";
import { generateTitle, generateDescription } from "@/lib/seo";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontPoppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const fontMono = Inter({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const fontInstrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const fontPublicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bulkctc.com"),
  title: {
    default: generateTitle("Bulk CTC Tea Supplier Across India"),
    template: `%s | BulkCTC`,
  },
  description: generateDescription(
    "Wholesale bulk CTC tea for hotels, factories, offices, and institutions across India. Direct from Assam and Dooars gardens."
  ),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/icon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/icon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    title: generateTitle("Bulk CTC Tea Supplier Across India"),
    description: generateDescription(
      "Wholesale bulk CTC tea for hotels, factories, offices, and institutions across India. Direct from Assam and Dooars gardens."
    ),
    images: [
      {
        url: "https://bulkctc.com/og.png",
        width: 1200,
        height: 630,
        alt: "BulkCTC — Wholesale Bulk CTC Tea Across India",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: generateTitle("Bulk CTC Tea Supplier Across India"),
    description: generateDescription(
      "Wholesale bulk CTC tea for hotels, factories, offices, and institutions across India. Direct from Assam and Dooars gardens."
    ),
    images: ["https://bulkctc.com/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <meta name="p:domain_verify" content="263c83126f8d79bccabc00711d8d80c6" />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontPoppins.variable,
          fontMono.variable,
          fontInstrumentSans.variable,
          fontPublicSans.variable,
        )}
      >
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9319508737367893"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XPEBV7XMDM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XPEBV7XMDM');
          `}
        </Script>
        <RootProviders>{children}</RootProviders>
        {/* <UserJotWidget /> */}
        <WhatsappWidget />
        {/* <IntercomChat /> */}
        {/* <Script id="crisp-chat" strategy="afterInteractive">
          {`
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = "db496e2e-4326-4f7d-82ab-369ab666fb46";
            (function () {
              var d = document;
              var s = d.createElement("script");
              s.src = "https://client.crisp.chat/l.js";
              s.async = 1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
        </Script> */}
        {/* <Script>
          {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");
    script.src="${(process.env.NEXT_PUBLIC_CHATBASE_HOST || "https://www.chatbase.co/") + "embed.min.js"}";
    script.id="${process.env.NEXT_PUBLIC_CHATBOT_ID}";
    script.domain="${process.env.NEXT_PUBLIC_CHATBASE_HOST || "www.chatbase.co"}";
    document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
        </Script> */}
      </body>
    </html>
  );
}
