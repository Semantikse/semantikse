import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";

import Head from "next/head";
import "./globals.css";

const newake = localFont({
  src: "./fonts/Newake-Font-Demo.otf",
  variable: "--font-newake",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Semantikse",
  description: "Unofficial version of Cemantix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${newake.variable} ${geist.variable} h-full antialiased`}
    >
      <Head>
        <meta name="apple-mobile-web-app-title" content="Semantikse" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className="h-dvh overflow-y-auto bg-orange-50 flex flex-col font-geist">
        {children}
      </body>
    </html>
  );
}
