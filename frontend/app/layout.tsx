import type { Metadata } from "next";
import { IBM_Plex_Mono, Roboto, Sora } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Danie Design — Creative, Design & Digital Marketing for Growing Brands",
    template: "%s — Danie Design",
  },
  description:
    "Danie Design is a full-service creative digital agency. We build recognizable brands, strong websites and digital experiences designed to turn attention into meaningful action.",
  keywords: [
    "branding",
    "UI/UX design",
    "web development",
    "digital marketing",
    "creative agency",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${roboto.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}