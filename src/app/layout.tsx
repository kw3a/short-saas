import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig, siteUrl } from "@/lib/site";
import { resolveRequestLocale } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ViralShort — AI Faceless Video Generator",
    template: "%s | ViralShort",
  },
  description:
    "Create viral faceless short videos from scripts or AskReddit threads. Generate subtitles, AI voiceover, and cinematic backgrounds for TikTok, YouTube Shorts and Reels.",
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: "ViralShort" }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "ViralShort — AI Faceless Video Generator",
    description:
      "Create viral faceless short videos from scripts or AskReddit threads. AI voiceover, subtitles and cinematic backgrounds in minutes.",
    url: siteUrl,
    locale: "en_US",
    alternateLocale: ["es_ES"],
    // og image is provided by app/opengraph-image.tsx (file convention)
  },
  twitter: {
    card: "summary_large_image",
    title: "ViralShort — AI Faceless Video Generator",
    description:
      "Create viral faceless short videos from scripts or AskReddit threads in minutes.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveRequestLocale();
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
