import type { Metadata } from 'next'

import { Caveat, DM_Sans, Source_Serif_4 } from 'next/font/google'

import { Header } from '@/components/header'
import { TransitionProvider } from '@/components/transition'

import { cn } from '@/lib/utils'
import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '700'],
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700'],
})

export const metadata: Metadata = {
  title: "Antje's Art",
}

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'font-caveat relative flex min-h-svh flex-col antialiased',
          caveat.style,
          dmSans.style,
          sourceSerif4.style
        )}
      >
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `url('/bg.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply',
            opacity: 0.8,
          }}
        />
        <TransitionProvider>
          <Header />
          {children}
        </TransitionProvider>
      </body>
    </html>
  )
}

export default RootLayout
