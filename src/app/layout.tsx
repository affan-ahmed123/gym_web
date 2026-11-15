import type { Metadata } from "next";
import { Bebas_Neue, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Ahsan Hussain | Certified Personal Fitness Trainer — Karachi",
  description:
    "Level 1 & 2 UK Registered Certified Fitness Trainer in Karachi. Private & online personal training for body transformation, fat loss, hypertrophy, TRX & rehabilitation coaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${barlowCondensed.variable} ${barlow.variable} overflow-x-hidden`}
    >
      <body className="font-sans bg-obsidian-950 text-steel-100 antialiased selection:bg-steel-200 selection:text-obsidian-950 overflow-x-hidden min-w-0 w-full">
        {children}
      </body>
    </html>
  );
}

