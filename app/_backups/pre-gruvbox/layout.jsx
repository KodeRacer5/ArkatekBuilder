import "@/app/_styles/globals.css";
import { Playfair_Display, DM_Sans, Audiowide } from "next/font/google";
import { cn } from '../_lib/utils'
import NprogressProviders from "../_providers/nprogress-provider";
import ThemeProvider from "../_providers/theme-provider";
import { ShelfThemeProvider } from "../_providers/shelf-theme-context";
import { Toaster } from "../_components/ui/toaster";

const fontDisplay = Playfair_Display({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-display",
})

const fontSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontTech = Audiowide({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-tech",
})

if (typeof Promise.withResolvers === "undefined") {
  if (typeof window !== 'undefined') {
    window.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => { resolve = res; reject = rej })
      return { promise, resolve, reject }
    }
  } else {
    global.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => { resolve = res; reject = rej })
      return { promise, resolve, reject }
    }
  }
}

export const metadata = {
  title: 'Peptide Journal — Longevity Medicine & Protocols',
  description: 'The definitive publication for peptide science, longevity medicine, and advanced biological protocols.',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontDisplay.variable, fontTech.variable)}>
        <NprogressProviders>
          <ThemeProvider attribute="class" defaultTheme="dark">
              <ShelfThemeProvider>
                {children}
                <Toaster />
              </ShelfThemeProvider>
          </ThemeProvider>
        </NprogressProviders>
      </body>
    </html>
  );
}


