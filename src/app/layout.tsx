import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppShell from '@/components/AppShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Depo Yönetim Sistemi',
  description: 'Trendyol satıcıları için profesyonel depo ve stok yönetim paneli',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  )
}
