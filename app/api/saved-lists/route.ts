import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SavedList from '@/lib/models/savedList';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const authResult = await verifyAuth(req);
        if (!authResult.isValid || !authResult.userId) {
            return NextResponse.json(
                { message: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }

        await connectDB();
        const savedLists = await SavedList.find().sort({ creationDate: -1 });
        return NextResponse.json(savedLists);
    } catch (error) {
        console.error('Error fetching saved lists:', error);
        return NextResponse.json(
            { message: 'Failed to fetch saved lists' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const authResult = await verifyAuth(req);
        console.log('Auth result:', authResult);
        
        if (!authResult.isValid || !authResult.userId) {
            return NextResponse.json(
                { message: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }

        await connectDB();
        const data = await req.json();
        console.log('Received data:', data);
        
        if (!data || !Array.isArray(data.responseCodes) || !Array.isArray(data.imageUrls)) {
            console.log('Invalid data structure:', data);
            return NextResponse.json(
                { message: 'Invalid request body' },
                { status: 400 }
            );
        }

        const listData = {
            name: data.name || `Saved List ${new Date().toLocaleDateString()}`,
            creationDate: new Date(),
            responseCodes: data.responseCodes,
            imageUrls: data.imageUrls
        };
        
        console.log('Creating list with data:', listData);
        const savedList = await SavedList.create(listData);
        console.log('Created list:', savedList);

        return NextResponse.json(savedList);
    } catch (error) {
        console.error('Error creating saved list:', error);
        return NextResponse.json(
            { message: 'Failed to create saved list' },
            { status: 500 }
        );
    }
}
