import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/site/navbar";

import "./globals.css";

import { Footer } from "@/components/site/footer";
import { PageTransition } from "@/components/ui/page-transition";

import { siteConfig } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden bg-gray-50 text-gray-800 antialiased`}
      >
        <Navbar />
        <PageTransition>
          <main className="min-h-screen w-full pt-20">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-16">
              {children}
            </div>
          </main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
