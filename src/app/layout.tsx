import { Inter } from 'next/font/google';

import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pocket Adviser',
  description: 'Investing app',
}

export default async function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}
