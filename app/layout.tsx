import React from 'react'
import App from '@/App'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <App>{children}</App>
      </body>
    </html>
  )
} 