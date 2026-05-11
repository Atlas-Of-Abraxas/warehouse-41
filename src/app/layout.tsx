import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Monoton, Bungee, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

const monoton = Monoton({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-arcade", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Warehouse 41 — Your Local Game Store & Playspace",
  description:
    "Magic: The Gathering, Kill Team, D&D, World of Darkness — shop, play, and connect at Warehouse 41.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${monoton.variable} ${bungee.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
