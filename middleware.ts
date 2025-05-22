import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let token = request.cookies.get('authToken')?.value || 
                request.headers.get('Authorization');
    
    if (token) {
        token = token.replace(/^Bearer\s+/i, '');
        
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('Authorization', `Bearer ${token}`);
        
        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        });
    }

    if (request.nextUrl.pathname.startsWith('/search/')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/protected/:path*',
        '/search/:path*'
    ]
};
