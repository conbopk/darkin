import "~/styles/globals.css";

import type {Metadata, Viewport} from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "~/components/providers";
import React from "react";

export const metadata: Metadata = {
  title: "Darkin",
  description: "Text to Speech, Sound Effect generation and voice conversion app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width"
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-svh flex-col antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
