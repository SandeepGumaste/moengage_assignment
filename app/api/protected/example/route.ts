import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';

export const GET = withAuth(async (userId, req) => {
    return NextResponse.json({
        message: 'This is a protected route',
        userId: userId
    });
});
