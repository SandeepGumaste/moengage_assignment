import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SavedList from '@/lib/models/savedList';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const authResult = await verifyAuth(req);
        // console.log('Auth result:', authResult);
        
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
        
        if (!authResult.isValid || !authResult.userId) {
            return NextResponse.json(
                { message: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }

        await connectDB();
        const data = await req.json();
        
        if (!data || !Array.isArray(data.responseCodes) || !Array.isArray(data.imageUrls) || !data.name) {
            return NextResponse.json(
                { message: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Check if a list with the same name already exists
        const existingList = await SavedList.findOne({ name: data.name });
        if (existingList) {
            return NextResponse.json(
                { message: 'A list with this name already exists' },
                { status: 409 }
            );
        }

        const savedList = await SavedList.create({
            name: data.name,
            email: data.email || 'user@example.com', // Default email, should be replaced with actual user email
            creationDate: new Date(),
            responseCodes: data.responseCodes,
            imageUrls: data.imageUrls
        });
        // console.log('Created list:', savedList);

        return NextResponse.json(savedList);
    } catch (error) {
        console.error('Error creating saved list:', error); 
        return NextResponse.json(
            { message: 'Failed to create saved list' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const authResult = await verifyAuth(req);
        
        if (!authResult.isValid || !authResult.userId) {
            return NextResponse.json(
                { message: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }

        await connectDB();        const url = new URL(req.url);
        const name = url.searchParams.get('name');
        const email = url.searchParams.get('email');

        if (!name || !email) {
            return NextResponse.json(
                { message: 'Both list name and email are required' },
                { status: 400 }
            );
        }

        const deletedList = await SavedList.findOneAndDelete({ name, email });

        if (!deletedList) {
            return NextResponse.json(
                { message: 'List not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Error deleting list:', error);
        return NextResponse.json(
            { message: 'Failed to delete list' },
            { status: 500 }
        );
    }
}
