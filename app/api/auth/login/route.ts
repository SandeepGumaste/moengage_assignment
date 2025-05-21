import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await connectDB();
        
        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = generateToken(user._id);

        const response = NextResponse.json({
            message: 'Login successful',
            token
        });

        response.cookies.set({
            name: 'authToken',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 
        });

        return response;

    } catch (error: Error | unknown) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Error during login' },
            { status: 500 }
        );
    }
}
