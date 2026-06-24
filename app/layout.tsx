import { Cormorant_Garamond, Space_Grotesk, Fragment_Mono } from "next/font/google"
import { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { siteConfig } from "@/config/site"
import CustomCursor from "@/components/layout/CustomCursor"
import PageTransition from "@/components/layout/PageTransition"
import DoomTribute from "@/components/layout/DoomTribute"
import SmoothScroll from "@/components/layout/SmoothScroll"

// Configure Serif Display Font (Cormorant Garamond)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

// Configure Sans Body Font (Space Grotesk)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

// Configure Monospace Font (Fragment Mono)
const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.seo.description,
  keywords: [
    "freelancer fullstack", "desenvolvedor nextjs", "desenvolvedor typescript", 
    "integração de ia", "sistemas sob medida", "mvp em 3 semanas", 
    "landing page rápida", "cultura vinil", "hip hop dev", "jazz coder",
    "bruce dev", "bruce portfolio", "desenvolvedor web sao paulo"
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.seo.url),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.seo.url,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.seo.title,
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "antialiased scroll-smooth dark",
        cormorant.variable,
        spaceGrotesk.variable,
        fragmentMono.variable
      )}
      style={{ colorScheme: "dark" }}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-black">
        {/* Analog noise grain texture */}
        <div className="grain-overlay" />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Lenis Smooth Scroll */}
          <SmoothScroll />
          {/* Custom smoothing desktop cursor */}
          <CustomCursor />
          {/* Hidden tribute easter egg modal */}
          <DoomTribute />
          
          <Header />
          <main className="flex-grow relative z-10">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
