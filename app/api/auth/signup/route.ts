import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user';
import { generateToken, setAuthCookie } from '@/lib/auth';

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

        const token = await generateToken(user._id.toString());
        const response = NextResponse.json({
            message: 'User created successfully',
            token,
            userId: user._id.toString()
        }, { status: 201 });

        setAuthCookie(token, response);
        return response;

    } catch (error) {
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
