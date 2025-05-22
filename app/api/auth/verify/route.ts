import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const authResult = await verifyAuth(req);
        if (!authResult.isValid) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }
        return NextResponse.json({ valid: true });
    } catch {
        return NextResponse.json({ valid: false }, { status: 401 });
    }
}
