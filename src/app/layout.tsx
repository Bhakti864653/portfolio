import type { Metadata, Viewport } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { RouteFocus } from "@/components/RouteFocus";
import { SiteHeader } from "@/components/SiteHeader";
import { PREFS_BOOT_SCRIPT } from "@/lib/prefs";
import { SITE } from "@/lib/projects";
import "./globals.css";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});
const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const description =
  "Bhakti Ahir: a student developer in Panama building human-centered tools for learning, opportunity, and community. Four live projects: Portico, Synaptiq, Concord, and CommonGround.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Bhakti Ahir — Technology should expand what people can do",
    template: "%s — Bhakti Ahir",
  },
  description,
  authors: [{ name: "Bhakti Ahir", url: SITE.github }],
  openGraph: {
    type: "website",
    siteName: "Bhakti Ahir",
    title: "Bhakti Ahir",
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Bhakti Ahir", description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#121615" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RouteFocus />
      </body>
    </html>
  );
}
