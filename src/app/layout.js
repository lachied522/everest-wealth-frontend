import { Inter } from 'next/font/google';

import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Palladian',
  description: 'Investing app',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/css/everest-wealth.webflow.16b3dffc1.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}
