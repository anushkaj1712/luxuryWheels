import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { SITE_NAME, SITE_TAGLINE } from "@/constants/site";
import { getPublicSiteUrl } from "@/lib/public-env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

/**
 * Root metadata — OpenGraph + SEO defaults (override per route with `generateMetadata`).
 */
export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
  title: { default: `${SITE_NAME} | ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description:
    "Drive Luxury Wheels — curated supercars, bespoke financing, white-glove delivery, and a digital atelier for collectors.",
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} min-h-screen antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
