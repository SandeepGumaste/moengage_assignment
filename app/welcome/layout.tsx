import React, { ReactNode } from 'react'

type Props = {children: ReactNode}


export default function WelcomePageLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        {children}
      </body>
    </html>
  );
}