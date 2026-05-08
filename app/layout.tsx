import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://businessboost.app"),
  title: {
    default: "BusinessBoost — Turn business slides into smart study quizzes",
    template: "%s · BusinessBoost",
  },
  description:
    "Upload your business class PowerPoints. BusinessBoost organizes them into modules and generates AI-powered quizzes so you study smarter, not harder.",
  keywords: [
    "study app",
    "ai quizzes",
    "business school",
    "powerpoint to quiz",
    "spaced repetition",
    "flashcards",
  ],
  openGraph: {
    title: "BusinessBoost",
    description:
      "Turn your business slides into adaptive AI study quizzes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased selection:bg-primary/30">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
