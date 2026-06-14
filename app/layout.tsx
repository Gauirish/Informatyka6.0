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
  title: "Informatyka 6.0",
  description: "A fun and engaging event by IEEE CSKS 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.sessionStorage && window.sessionStorage.getItem('hasSeenIntro') === 'true') {
                  document.documentElement.classList.add('has-seen-intro');
                }
              } catch (e) {}
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
