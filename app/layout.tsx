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

export const metadata = {
  title: "Informatyka 6.0 | IEEE Computer Society Kerala Section",
  description:
    "Informatyka 6.0 is a premier technology and innovation event organized by IEEE Computer Society Kerala Section. Explore workshops, competitions, speakers, and technical sessions.",

  keywords: [
    "Informatyka",
    "Informatyka 6.0",
    "IEEE",
    "IEEE Computer Society",
    "IEEE Kerala Section",
    "Computer Society Kerala",
    "Technology Event Kerala",
    "Tech Fest Kerala",
    "IEEE Event",
    "Student Technology Event",
    "Programming Competition",
    "Hackathon Kerala",
    "Innovation Event",
    "Engineering Students Kerala",
    "Computer Science Event",
    "Technical Workshop",
    "Software Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Cyber Security",
    "Web Development",
    "Tech Conference",
    "Engineering Event India",
    "Student Innovation",
    "Technology Community"
  ],

  openGraph: {
    title: "Informatyka 6.0",
    description:
      "Official website of Informatyka 6.0 - Technology and Innovation Event.",
    url: "https://informatyka6-0.vercel.app",
    siteName: "Informatyka 6.0",
    type: "website",
  },
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
