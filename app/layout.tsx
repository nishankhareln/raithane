import type { Metadata } from "next";
import { Geist, Baloo_2 } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const deva = Baloo_2({ variable: "--font-deva", subsets: ["latin", "devanagari"], weight: ["700", "800"] });

export const metadata: Metadata = {
  title: "Raithane — Discover Nepal through the people who live it",
  description:
    "A destination & creator-economy platform for Nepal. Discover places through locals, unlock cultural stories, and book real experiences — every action pays a local.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${deva.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
