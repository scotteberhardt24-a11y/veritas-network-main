import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veritas Trust Ledger - Trust Infrastructure for Gig Economy",
  description: "Decentralized trust verification, escrow protection, TruScore reputation, and fraud-resistant identity infrastructure",
  keywords: "trust, verification, escrow, gig economy, freelance, reputation",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://veritas-truscore.vercel.app",
    title: "Veritas Trust Ledger",
    description: "Decentralized trust verification platform for the gig economy",
    images: [
      {
        url: "/mainlogo.png",
        width: 1200,
        height: 630,
        alt: "Veritas Trust Ledger",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="icon" href="/mainlogo.png" />
      </head>
      <body className="bg-black text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
