import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Playlist Creator',
  description: 'Create the perfect playlist using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <nav className="w-full flex justify-end p-4 bg-gray-900">
          <Link href="/profile">
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
              Profile
            </button>
          </Link>
        </nav>
        {children}
      </body>
    </html>
  )
} 