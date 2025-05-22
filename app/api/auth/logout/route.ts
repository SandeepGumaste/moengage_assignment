import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ActiveSession from '@/lib/models/activeSession';

export async function POST(req: Request) {
    try {
        await connectDB();
        
        const token = req.headers.get('Authorization')?.replace('Bearer ', '') || 
                     req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'No session found' },
                { status: 400 }
            );
        }

        // Remove the session from database
        await ActiveSession.deleteOne({ token });

        // Create response that will clear the auth cookie
        const response = NextResponse.json({ message: 'Logged out successfully' });
        response.cookies.set('authToken', '', { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0 // This will cause the cookie to be deleted
        });

        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Error during logout' },
            { status: 500 }
        );
    }
}
