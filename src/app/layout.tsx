import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { CartSheet } from "@/components/cart-sheet";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MainNav } from "@/components/main-nav";
import { Providers } from "@/components/providers";
import { SITE_DESCRIPTION } from "@/lib/site-seo";
import { createClient } from "@/utils/supabase/server";
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
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://lhestamall.com",
    siteName: "Lhesta Mall",
    title: "Lhesta Mall | Shop the latest trends online",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 400,
        alt: "Lhesta Mall – shop curated goods delivered fast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lhesta Mall | Shop the latest trends online",
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://lhestamall.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lhesta Mall",
    alternateName: ["LhestaMall", "lhestamall.com"],
    url: "https://lhestamall.com",
    description: SITE_DESCRIPTION,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-(--color-bg) text-(--color-text)`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers initialUser={user}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartSheet />
        </Providers>
        <Script async
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6365400422443304"
          strategy="afterInteractive"
          crossOrigin="anonymous"
         />
      </body>
    </html>
  );
}
