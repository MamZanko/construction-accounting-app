import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-kurdish",
  subsets: ["arabic"],
  // 400 (body) and 700 (headings) cover all critical first-paint text.
  // 500 and 600 are pulled in by the browser on demand via font-display: swap.
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "سیستەمی ژمێریاری ـ کۆمپانیای کەرەستەی بیناسازی",
  description: "بەڕێوەبردنی فرۆش، کڕیار، کەرەستە و خەرجی بۆ کۆمپانیای کەرەستەی بیناسازی",
  generator: "v0.app",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#3B82F6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ckb" dir="rtl" className={`${notoSansArabic.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
