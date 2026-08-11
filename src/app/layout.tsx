import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { siteConfig } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "TaskFlow — Make progress visible",
    template: "%s | TaskFlow",
  },
  description: siteConfig.description,
  applicationName: "TaskFlow",
  keywords: [
    "task management",
    "productivity",
    "dashboard",
    "project planning",
  ],
  openGraph: {
    title: "TaskFlow — Make progress visible",
    description: "Plan clearly, focus deliberately, and move work forward.",
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow — Make progress visible",
    description: "Plan clearly, focus deliberately, and move work forward.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#110f1d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
