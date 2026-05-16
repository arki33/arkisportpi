import type React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppWrapper } from "@/components/app-wrapper";
import { PWAInstaller } from "@/components/pwa-installer";
import "./globals.css";
<<<<<<< HEAD
import { SpeedInsights } from "@vercel/speed-insights/next";
=======
>>>>>>> aa3d42479f425630a9333d8553d79737968060b2

export const metadata: Metadata = {
  title: "Made with App Studio",
  description:
    "SPORTPI - Earn Pi through fitness activities. Track your workouts, compete with friends, and win rewards!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SPORTPI",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ["fitness", "pi network", "tracking", "rewards", "health"],
  authors: [{ name: "SPORTPI" }],
  creator: "SPORTPI Team",
  generator: "v0.app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4169E1",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <head>
        {/* PWA / Mobile */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="SPORTPI" />
        <meta name="mobile-web-app-capable" content="yes" />

<<<<<<< HEAD
        {/* ICONS */}
=======
        {/* Icons */}
>>>>>>> aa3d42479f425630a9333d8553d79737968060b2
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%234169E1' width='192' height='192'/><text x='50%' y='50%' font-size='120' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='central'>π</text></svg>"
        />

        <link
          rel="apple-touch-icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect fill='%234169E1' width='180' height='180' rx='40'/><text x='90' y='90' font-size='120' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='central'>π</text></svg>"
        />

<<<<<<< HEAD
        {/* PI SDK */}
=======
        {/* PI SDK (ONLY LOAD SCRIPT) */}
>>>>>>> aa3d42479f425630a9333d8553d79737968060b2
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="afterInteractive"
        />

        {/* Fonts */}
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>

      <body className="bg-background">
        <PWAInstaller />
        <AppWrapper>{children}</AppWrapper>
<<<<<<< HEAD

        {/* VERCEL ANALYTICS */}
        <SpeedInsights />
      </body>
    </html>
  );
}
=======
      </body>
    </html>
  );
}
>>>>>>> aa3d42479f425630a9333d8553d79737968060b2
