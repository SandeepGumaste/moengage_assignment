import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user';
import ActiveSession from '@/lib/models/activeSession';
import { generateToken, setAuthCookie } from '@/lib/auth';

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

        const token = await generateToken(user._id.toString());

        await ActiveSession.create({
            userId: user._id,
            token,
            lastActive: new Date()
        });

        const response = NextResponse.json({
            message: 'Login successful',
            token,
            userId: user._id.toString()
        });

        setAuthCookie(token, response);
        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Error during login' },
            { status: 500 }
        );
    }
}
