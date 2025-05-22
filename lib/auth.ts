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

export async function verifyAuth(req: Request): Promise<{ isValid: boolean; userId?: string; error?: string }> {
    try {
        let token = req.headers.get('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
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
            return { isValid: false, error: 'No token provided' };
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        
        if (typeof payload.userId !== 'string') {
            return { isValid: false, error: 'Invalid token payload' };
        }

        const session = await ActiveSession.findOneAndUpdate(
            { token },
            { $set: { lastActive: new Date() } },
            { new: true }
        );

        if (!session) {
            return { isValid: false, error: 'Session expired or invalid' };
        }

        return { isValid: true, userId: payload.userId };
    } catch (error) {
        console.error('Authentication error:', error);
        return { isValid: false, error: 'Invalid token' };
    }
}

export async function authenticate(req: Request): Promise<AuthPayload | NextResponse> {
    const authResult = await verifyAuth(req);

    if (!authResult.isValid) {
        return new NextResponse(
            JSON.stringify({ message: authResult.error }),
            { status: 401 }
        );
    }

    return { userId: authResult.userId!, exp: undefined } as AuthPayload;
}

export function setAuthCookie(token: string, response: NextResponse): void {
    response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 
    });
}
