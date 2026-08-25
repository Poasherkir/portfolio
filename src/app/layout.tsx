import type { Metadata, Viewport } from "next";
import { Inter, Archivo_Black, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { profile, seo } from "@/data/portfolio";
import { Providers } from "@/components/providers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollProgress from "@/components/layout/scroll-progress";
import InstrumentBackground from "@/components/background/instrument-background";
import SmoothScroll from "@/components/smooth-scroll";
import DevChecklist from "@/components/dev-checklist";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: seo.title,
    template: `%s · ${profile.name}`,
  },
  description: seo.description.long,
  keywords: [...seo.keywords],
  authors: [{ name: profile.name, url: profile.site }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: profile.site,
    siteName: profile.name,
    title: seo.title,
    description: seo.description.short,
    // Images intentionally omitted: src/app/opengraph-image.tsx generates them.
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description.short,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#070c14" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Person + ProfilePage structured data, so search engines know who this is. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  dateModified: new Date().toISOString().split("T")[0],
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    alternateName: profile.handle,
    url: profile.site,
    jobTitle: profile.role,
    description: seo.description.short,
    address: { "@type": "PostalAddress", addressLocality: "Algiers", addressCountry: "DZ" },
    knowsLanguage: ["en", "fr", "ar"],
    knowsAbout: [
      "Flutter",
      "Dart",
      "React",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Python",
      "Mobile application development",
      "Electronic Flight Bag",
    ],
    alumniOf: { "@type": "CollegeOrUniversity", name: "USTHB, Algiers" },
    sameAs: [profile.github],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} font-display`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[6000] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-foreground"
        >
          Skip to content
        </a>
        <Providers>
          <InstrumentBackground />
          <ScrollProgress />
          <Header />
          <SmoothScroll>
            {/* canvas-overlay-mode lets the pointer fall through the page to the
                3D keyboard behind it, while links, controls and text keep
                their own events. See globals.css. */}
            <main id="main" className="relative z-10 canvas-overlay-mode">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
          <DevChecklist />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
