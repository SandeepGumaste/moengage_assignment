import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import * as jose from 'jose';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: any;
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
        .sign(secret);
    
    return token;
}

export async function authenticate(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        // console.log('Token:', token);
        // console.log('Auth:', req.headers.get('Authorization'));

        if (!token) {
            return new NextResponse(
                JSON.stringify({ message: 'Authentication required' }),
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        return payload as { userId: string };
    } catch (error) {
        console.error('Authentication error:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Invalid token' }),
            { status: 401 }
        );
    }
}
