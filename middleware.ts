import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authenticate } from './lib/auth'


export async function middleware(request: NextRequest) {
    const protectedPaths = ['/search']
    const path = request.nextUrl.pathname

    if (protectedPaths.some(prefix => path.startsWith(prefix))) {
        const token = request.cookies.get('authToken')?.value || 
                     request.headers.get('Authorization')?.replace('Bearer ', '')
        // console.log('Token:', token)
        // console.log('Auth:', request.headers.get('Authorization'))

        if (!token) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            )
        }

        const requestWithToken = new Request(request.url, {
            headers: new Headers({
                ...Object.fromEntries(request.headers.entries()),
                'Authorization': `Bearer ${token}`
            })
        })

        const authResult = await authenticate(requestWithToken)
        
        if ('status' in authResult && authResult.status === 401) {
            return NextResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 }
            )
        }
        
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('user-id', (authResult as { userId: string }).userId)
        
        const response = NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })

        if (!request.cookies.has('authToken') && token) {
            response.cookies.set({
                name: 'authToken',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 
            })
        }

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/search/:path*',
        '/api/protected/:path*',
    ],
}
