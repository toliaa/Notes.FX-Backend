import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Notes.FX - Архітектура системи',
  description: 'Документація архітектури та діаграми взаємодії модулів Notes.FX Backend',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" className="bg-[#0a0a0a]">
      <body className="antialiased">{children}</body>
    </html>
  )
}
