import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

import "./globals.css";
import Footer from "@/components/Footer";

import Navigation from "@/components/Navigation";
import Up from "@/components/Up";
import BreakingNews from "@/components/BreakingNews";

const inter = localFont({
  src: [
    {
      path: "../app/fonts/ArbFONTS-Al-Jazeera-Arabic-Bold.ttf",
      weight: "400",
      style: "normal",
    },
    // {
    //   path: "../public/fonts/Inter-Bold.woff2",
    //   weight: "700",
    //   style: "normal",
    // },
  ],
  variable: "--font-inter", // Optional: Use in Tailwind
});

// const geistSans = localFont({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Euro News",
  description: "Euro News - Your source for the latest news and updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              var storedTheme = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark;
              document.documentElement.classList.toggle('dark', shouldUseDark);
            } catch (e) {
              // Ignore theme init errors in unsupported environments.
            }
          `}
        </Script>
      </head>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body className={inter.className} suppressHydrationWarning>
        <Up />
        <Navigation />
        <BreakingNews />

        {/* <OtherCategories /> */}
        {/* <MainPictures /> */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
