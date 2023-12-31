import Navbar from "@/components/Navbar";
import "src/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
//import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "src/src/components/ui/toaster";
import { MathJaxContext } from "better-react-mathjax";

const title = "ScaffGen - AI Scaffold Generator";
const description = "Generate your AI Scaffolds in seconds";
const url = "https://www.qrgpt.io";
const ogimage = "https://www.qrgpt.io/og-image.png";
const sitename = "qrGPT.io";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />

        <main>{children}</main>
        {/* <Analytics /> */}

        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
