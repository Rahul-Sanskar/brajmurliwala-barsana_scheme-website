import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { TopBar } from "./_components/top-bar";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { WhatsAppFloat } from "./_components/whatsapp-float";
import { EnquiryProvider } from "./_components/enquiry-trigger";
import { PROJECT } from "./_data/project";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

// ── SEO metadata ──────────────────────────────────────────────────────
const siteUrl = "https://www.brajmurliwala.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Braj Murliwala Residency | 1, 2 & 3 BHK Flats in Barsana | Goverdhan Road",
    template: `%s | Braj Murliwala Residency — Barsana`,
  },

  description:
    "Braj Murliwala Residency offers 1, 2 and 3 BHK apartments on Goverdhan Road, Barsana (Mathura, Uttar Pradesh). Pre-launch price ₹7,999/sq.ft., starting ₹74 Lakh. View floor plans, price list and apply online.",

  keywords: [
    "Braj Murliwala Residency",
    "Barsana Urban Housing Scheme",
    "flats in Barsana",
    "1 BHK Barsana",
    "2 BHK Barsana",
    "3 BHK Barsana",
    "Goverdhan Road apartments",
    "residential project Barsana",
    "property near Radha Rani Temple",
    "Braj property",
    "homes in Barsana",
    "Barsana real estate",
    "property near Mathura",
    "Braj region residential",
    "SKG Infratech Barsana",
    "Barsana housing",
    "property Goverdhan Road",
  ],

  applicationName: PROJECT.portal.name,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "Braj Murliwala Residency — 1, 2 & 3 BHK Apartments in Barsana",
    description:
      "Premium residential apartments on Goverdhan Road, Barsana — near Radha Rani Temple. 1, 2 & 3 BHK. Pre-launch ₹7,999/sq.ft. Apply online.",
    type: "website",
    locale: "en_IN",
    siteName: "Braj Murliwala Residency",
    url: siteUrl,
    images: [
      {
        url: "/braj/hero/1-elevation-day.png",
        width: 1200,
        height: 630,
        alt: "Braj Murliwala Residency elevation — Goverdhan Road, Barsana",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Braj Murliwala Residency — Barsana",
    description:
      "1, 2 & 3 BHK apartments on Goverdhan Road, Barsana. Pre-launch ₹7,999/sq.ft.",
    images: ["/braj/hero/1-elevation-day.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// ── JSON-LD structured data ───────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: PROJECT.developer.name,
  url: siteUrl,
  telephone: PROJECT.contact.phonePrimary,
  email: PROJECT.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: PROJECT.location.address,
    addressLocality: PROJECT.location.city,
    addressRegion: PROJECT.location.state,
    addressCountry: "IN",
  },
};

const residenceSchema = {
  "@context": "https://schema.org",
  "@type": "Residence",
  name: PROJECT.name,
  description:
    "1, 2 and 3 BHK residential apartments on Goverdhan Road, Barsana, Uttar Pradesh.",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: PROJECT.location.address,
    addressLocality: PROJECT.location.city,
    addressRegion: PROJECT.location.district + ", " + PROJECT.location.state,
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(residenceSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-bmu-red focus:text-white focus:px-3 focus:py-2"
        >
          Skip to main content
        </a>
        <TopBar />
        <Header />
        <main id="main" className="flex-1">
          <EnquiryProvider>
            {children}
          </EnquiryProvider>
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
