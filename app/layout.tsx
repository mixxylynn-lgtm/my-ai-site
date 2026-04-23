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
  title: "CopyAI Pro — AI Listing Generator for eBay, Etsy & Amazon",
  description: "Upload a photo and get a high-converting eBay listing in 30 seconds. Built for flippers and resellers. Try free.",
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