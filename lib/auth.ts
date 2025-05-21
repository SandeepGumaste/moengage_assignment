import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: any;
}

export function generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

export async function authenticate(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return new NextResponse(
                JSON.stringify({ message: 'Authentication required' }),
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded;
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: 'Invalid token' }),
            { status: 401 }
        );
    }
}
