import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://copyaipro.xyz"),
  title: "CopyAI Pro — AI eBay Listing Generator | Write Listings with AI",
  description:
    "CopyAI Pro is an AI eBay listing generator and listing writer. Write optimized eBay, Etsy, Depop & Poshmark listings with AI in 30 seconds — plus suggested pricing. Try free.",
  keywords: [
    "AI eBay listing generator",
    "write eBay listings with AI",
    "AI Etsy listing tool",
    "eBay listing writer",
    "AI listing generator",
    "Etsy listing generator",
    "Depop listing generator",
    "Poshmark listing tool",
    "reseller tools",
  ],
  alternates: { canonical: "https://copyaipro.xyz" },
  openGraph: {
    type: "website",
    url: "https://copyaipro.xyz",
    siteName: "CopyAI Pro",
    title: "AI eBay Listing Generator — Write Listings with AI in 30s",
    description:
      "Write optimized eBay, Etsy, Depop & Poshmark listings with AI — plus suggested pricing — in 30 seconds. Built by a reseller. Try free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI eBay Listing Generator — CopyAI Pro",
    description:
      "Write optimized eBay & Etsy listings with AI in 30 seconds, plus suggested pricing. Try free.",
    creator: "@ThriftAndStack",
  },
  verification: {
    google: "efiqTFJBbUHcE7ChR4B5vU3uYtr66ejMnoATvSZWUE8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}