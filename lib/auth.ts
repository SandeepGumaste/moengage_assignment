import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import * as jose from 'jose';

export interface AuthPayload {
    userId: string;
    exp?: number;
}

export interface AuthenticatedRequest extends NextApiRequest {
    user?: AuthPayload;
}

export async function generateToken(userId: string): Promise<string> {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    const token = await new jose.SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expiresIn)
        .setIssuedAt()
        .sign(secret);
    
    return token;
}

export async function authenticate(req: Request): Promise<AuthPayload | NextResponse> {
    try {
        let token = req.headers.get('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            // Try to get token from cookie in the request
            const cookieHeader = req.headers.get('cookie');
            if (cookieHeader) {
                const cookies = Object.fromEntries(
                    cookieHeader.split('; ').map(c => {
                        const [key, ...v] = c.split('=');
                        return [key, v.join('=')];
                    })
                );
                token = cookies['authToken'];
            }
        }

        if (!token) {
            return new NextResponse(
                JSON.stringify({ message: 'Authentication required' }),
                { status: 401 }
            );
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        
        if (typeof payload.userId !== 'string') {
            throw new Error('Invalid token payload');
        }

        return { userId: payload.userId, exp: payload.exp } as AuthPayload;
    } catch (error) {
        console.error('Authentication error:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Invalid token' }),
            { status: 401 }
        );
    }
}

export function setAuthCookie(token: string, response: NextResponse): void {
    response.cookies.set({
        name: 'authToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 24 * 60 * 60 // 24 hours
    });
}
