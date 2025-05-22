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
        if (request.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json(
                { message: authResult.error },
                { status: 401 }
            );
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

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
        '/api/saved-lists/:path*',
        '/api/protected/:path*',
        '/search/:path*'
    ]
};
