import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/themes/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryProvider } from '@/components/provider/react-query'
import { SessionNextAuthProvider } from '@/components/provider/session-next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SessionNextAuthProvider>
              <div>{children}</div>
              <Toaster
                className="w-auto"
                position="top-center"
                closeButton={true}
              />
            </SessionNextAuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
