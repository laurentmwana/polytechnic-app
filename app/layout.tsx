import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '#/provider/themes/theme-provider'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '#/provider/auth/auth-provider'
import { ReactQueryProvider } from '@/src/provider/auth/react-query-provider'

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
            <AuthProvider>
              <div>{children}</div>
              <Toaster className="w-auto" position="top-center" />
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
