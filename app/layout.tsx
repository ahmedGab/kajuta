import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ClientLayout from "./ClientLayout";
import DataSyncProvider from "@/components/DataSyncProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Cajuta | Fruits secs caramélisés en Tunisie",
  description: "Cajuta est une marque artisanale tunisienne de fruits secs caramélisés premium. Découvrez nos amandes, noix de cajou, noisettes, et pistaches caramélisées.",
  openGraph: {
    title: "Cajuta | Fruits secs caramélisés en Tunisie",
    description: "Cajuta est une marque artisanale tunisienne de fruits secs caramélisés premium.",
    url: "https://cajuta.tn",
    siteName: "Cajuta",
    locale: "fr_TN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cajuta | Fruits secs caramélisés en Tunisie",
    description: "Cajuta est une marque artisanale tunisienne de fruits secs caramélisés premium.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} flex flex-col min-h-screen`}>
        <DataSyncProvider>
          <ClientLayout>{children}</ClientLayout>
        </DataSyncProvider>
      </body>
    </html>
  );
}