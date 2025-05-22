import { NextResponse } from 'next/server';
import { verifyAuth } from './auth';

type HandlerFunction = (userId: string, req: Request) => Promise<Response>;

export function withAuth(handler: HandlerFunction) {
    return async (req: Request) => {
        try {
            const token = req.headers.get('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return NextResponse.json(
                    { message: 'Authentication required' },
                    { status: 401 }
                );
            }

            const requestWithToken = new Request(req.url, {
                headers: new Headers({
                    ...Object.fromEntries(req.headers.entries()),
                    'Authorization': `Bearer ${token}`
                })
            });

            const authResult = await verifyAuth(requestWithToken);
            
            if (!authResult.isValid) {
                return NextResponse.json(
                    { message: authResult.error },
                    { status: 401 }
                );
            }

            return handler(authResult.userId!, req);
        } catch (error) {
            console.error('API auth error:', error);
            return NextResponse.json(
                { message: 'Internal server error' },
                { status: 500 }
            );
        }
    };
}
