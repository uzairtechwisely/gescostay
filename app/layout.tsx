import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Gesco Stay Campaigns",
    template: "%s | Gesco Stay",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    title: "Gesco Stay Campaigns",
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gesco Stay Campaigns",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-brand-bg)] font-sans text-[var(--color-brand-ink)]">
        <GoogleAnalytics analyticsId={siteConfig.analyticsId} />
        {children}
      </body>
    </html>
  );
}
