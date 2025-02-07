import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { type ReactNode, Suspense } from "react";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable}${geistMono.variable} antialiased`}
      >
        <script
          id="mamo-script"
          src="https://assets.mamopay.com/stable/checkout-permanent-2.1.0.min.js"
          // src="http://localhost:3001/checkout-permanent.min.js"
          async
        />
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
