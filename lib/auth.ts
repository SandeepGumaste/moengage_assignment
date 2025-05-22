import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import * as jose from 'jose';
import ActiveSession from '@/lib/models/activeSession';

export interface AuthPayload {
    userId: string;
    exp?: number;
}

export interface AuthenticatedRequest extends NextApiRequest {
    auth?: AuthPayload;
}

export async function generateToken(userId: string): Promise<string> {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
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

        const session = await ActiveSession.findOne({ token });
        if (!session) {
            return new NextResponse(
                JSON.stringify({ message: 'Session expired or invalid' }),
                { status: 401 }
            );
        }

        session.lastActive = new Date();
        await session.save();

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
    response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
    });
}
