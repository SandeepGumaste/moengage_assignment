import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authenticate } from './lib/auth'

export async function middleware(request: NextRequest) {
    // Define protected routes
    const protectedPaths = ['/search']
    
    const path = request.nextUrl.pathname

    if (protectedPaths.some(prefix => path.startsWith(prefix))) {
        const authResult = await authenticate(request)
        
        if ('status' in authResult && authResult.status === 401) {
            const response = NextResponse.redirect(new URL('/', request.url))
            return response
        }
        
        // Clone the request headers and add user info
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('user-id', (authResult as { userId: string }).userId)

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/search/:path*',
        '/api/protected/:path*',
    ],
}
