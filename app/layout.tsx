import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/themes/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { SessionNextAuthProvider } from '@/components/auth-provider'
import { Geist, Geist_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Polytechnique Application',
  description: 'Une application web pour la faculté de polytechnique ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased',
          'h-full'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionNextAuthProvider>
            <div className="h-full">{children}</div>
            <Toaster
              className="w-auto"
              position="top-center"
              closeButton={true}
            />
          </SessionNextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
