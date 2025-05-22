import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value || 
                 request.headers.get('Authorization')?.replace('Bearer ', '');

    const requestWithToken = new Request(request.url, {
        headers: new Headers({
            ...Object.fromEntries(request.headers.entries()),
            'Authorization': `Bearer ${token || ''}`
        })
    });

    const authResult = await verifyAuth(requestWithToken);
    
    if (!authResult.isValid) {
        // For API routes, return JSON response
        if (request.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json(
                { message: authResult.error },
                { status: 401 }
            );
        }
        // For other routes, redirect to home page
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Add userId to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', authResult.userId!);
    
    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
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
