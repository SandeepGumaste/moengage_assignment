import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await connectDB();
        
        const { email, password } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already registered' },
                { status: 400 }
            );
        }

        const user = await User.create({
            email,
            password
        });

        const token = generateToken(user._id);

        const response = NextResponse.json({
            message: 'User created successfully',
            token
        }, { status: 201 });

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
        let errorMessage = 'Error creating user';
        
        if (error && typeof error === 'object' && 'errors' in error) {
            const validationError = error as { errors: { [key: string]: { message: string } } };
            const errorKeys = Object.keys(validationError.errors);
            if (errorKeys.length > 0) {
                console.error('Signup error:', JSON.stringify(validationError.errors[errorKeys[0]].message));
                errorMessage = validationError.errors[errorKeys[0]].message;
            }
        }
        
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}
