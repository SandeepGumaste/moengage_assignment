import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = { hide: boolean }

const Navbar = ({ hide }: Props) => {
  const pathname = usePathname()

  if (hide) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">HTTP Dogs</h1>
          </div>
          <div className="flex gap-4">
            <Button
              asChild
              variant={pathname === '/search' ? 'default' : 'outline'}
            >
              <Link href="/search">Search</Link>
            </Button>
            <Button
              asChild
              variant={pathname === '/list' ? 'default' : 'outline'}
            >
              <Link href="/list">List</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar