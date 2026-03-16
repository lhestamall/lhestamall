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
  metadataBase: new URL("https://lhestamall.com"),
  title: "LhestaMall",
  description: "Shop Smart. Import Better. Quality imports at better prices for Ghana from LhestaMall.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://lhestamall.com",
    siteName: "LhestaMall",
    title: "LhestaMall | Shop Smart. Import Better.",
    description: "Quality imports at better prices for Ghana. Reserve pre‑orders and shop trusted products at LhestaMall.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 400,
        alt: "LhestaMall – Shop Smart. Import Better.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LhestaMall | Shop Smart. Import Better.",
    description: "Quality imports at better prices for Ghana from LhestaMall.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://lhestamall.com",
  },
};

import { CartSheet } from "@/components/cart-sheet";
import { Header } from "@/components/header";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-(--color-bg) text-(--color-text)`}
        suppressHydrationWarning
      >
        <Providers initialUser={user}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartSheet />
        </Providers>
      </body>
    </html>
  );
}
