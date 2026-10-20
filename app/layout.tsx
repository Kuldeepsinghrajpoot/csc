import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore: side-effect import for global CSS
import "./globals.css";
import Header from '@/components/header'
import Navbar from "./nav";
import Footer from "./(home)/footer/page";
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Home - Pradeep CSC",
  description: "Pradeep CSC & Digital Seva Kendra is a local common service center providing government and digital services to the community. We help citizens with Aadhaar, PAN, utility payments, and many other government-to-citizen services.",
  // icon.png, apple-icon.png, favicon.ico, opengraph-image.png and twitter-image.png
  // in this folder are picked up automatically; they all use the CSC logo.
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Pradeep CSC",
    title: "Pradeep CSC & Digital Seva Kendra",
    description:
      "Aadhaar, PAN, bill payments and government services at your local Common Service Centre.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "CSC logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pradeep CSC & Digital Seva Kendra",
    description:
      "Aadhaar, PAN, bill payments and government services at your local Common Service Centre.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader />
        {/* <Header />
         */}
        <Navbar />
        {children}
        <Footer />

      </body>
    </html>
  );
}
