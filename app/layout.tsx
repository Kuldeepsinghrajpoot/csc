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

export const metadata: Metadata = {
  title: "Home - Pradeep CSC",
  description: "Pradeep CSC & Digital Seva Kendra is a local common service center providing government and digital services to the community. We help citizens with Aadhaar, PAN, utility payments, and many other government-to-citizen services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
