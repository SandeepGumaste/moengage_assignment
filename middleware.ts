import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticate, AuthPayload } from './lib/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value || 
                 request.headers.get('Authorization')?.replace('Bearer ', '');

    const requestWithToken = new Request(request.url, {
        headers: new Headers({
            ...Object.fromEntries(request.headers.entries()),
            'Authorization': `Bearer ${token || ''}`
        })
    });

    const authResult = await authenticate(requestWithToken);
    
    if ('status' in authResult && authResult.status === 401) {
        // For API routes, return JSON response
        if (request.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }
        // For other routes, redirect to home page
        return NextResponse.redirect(new URL('/', request.url));
    }

    const payload = authResult as AuthPayload;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', payload.userId);
    
    const response = NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });

    // Set or refresh the auth cookie if needed
    if (!request.cookies.has('authToken') && token) {
        response.cookies.set({
            name: 'authToken',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 // 24 hours
        });
    }

    return response;
}

export const config = {
    matcher: [
        // Match all protected API routes
        '/api/saved-lists/:path*',
        '/api/protected/:path*',
        // Match all protected pages
        '/search/:path*'
    ]
};
