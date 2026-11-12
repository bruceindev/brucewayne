import { Inter_Tight, Instrument_Serif, Fragment_Mono } from "next/font/google"
import { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { siteConfig } from "@/config/site"
import PageTransition from "@/components/layout/PageTransition"
import DoomTribute from "@/components/layout/DoomTribute"
import SmoothScroll from "@/components/layout/SmoothScroll"

// Grotesk apertada (headlines + corpo) — pegada Butter
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

// Serifa itálica para o toque "cozy"
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
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
        "antialiased",
        interTight.variable,
        instrumentSerif.variable,
        fragmentMono.variable
      )}
      style={{ colorScheme: "light" }}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-[#3B82F6] selection:text-white">
        {/* Analog noise grain texture */}
        <div className="grain-overlay" />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Lenis Smooth Scroll */}
          <SmoothScroll />
          {/* Hidden tribute easter egg modal */}
          <div className="dark">
            <DoomTribute />
          </div>
          
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
