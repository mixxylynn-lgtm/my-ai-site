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
  title: "CopyAI Pro — Photo to Marketplace Listing on Telegram",
  description:
    "Send a photo to the CopyAI Pro Telegram bot and get a full marketplace listing back in seconds — eBay, Etsy, Depop, Poshmark, Facebook Marketplace and more. One-time $4.99.",
  keywords: [
    "AI listing generator",
    "photo to listing",
    "Telegram listing bot",
    "eBay listing generator",
    "Etsy listing tool",
    "Depop listing generator",
    "Poshmark listing tool",
    "Facebook Marketplace listing",
    "reseller tools",
  ],
  alternates: { canonical: "https://copyaipro.xyz" },
  openGraph: {
    type: "website",
    url: "https://copyaipro.xyz",
    siteName: "CopyAI Pro",
    title: "Get a full marketplace listing from any photo in seconds",
    description:
      "Send a photo to our Telegram bot and get a complete listing back instantly — eBay, Etsy, Depop, Poshmark, Facebook Marketplace and more. One-time $4.99.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CopyAI Pro — Photo to Marketplace Listing on Telegram",
    description:
      "Send a photo to our Telegram bot and get a full marketplace listing back in seconds. One-time $4.99.",
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