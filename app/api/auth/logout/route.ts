import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import ActiveSession from '@/lib/models/activeSession';

export async function POST(req: Request) {
    try {
        await connectDB();
        const cookieStore = await cookies();
        const token = req.headers.get('Authorization')?.replace('Bearer ', '') || 
                     cookieStore.get('authToken')?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'No session found' },
                { status: 400 }
            );
        }

        await ActiveSession.deleteOne({ token });

        const response = NextResponse.json({ message: 'Logged out successfully' });
        response.cookies.set('authToken', '', { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0 
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
