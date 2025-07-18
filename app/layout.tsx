import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ConvexClientProvider from '@/providers/ConvexClientProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/ui/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Real time chat app',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-gr='false' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
          storageKey='theme'
        >
          <ConvexClientProvider>
            <TooltipProvider>
              {children || <div>No content available</div>}
            </TooltipProvider>
            <Toaster richColors />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
