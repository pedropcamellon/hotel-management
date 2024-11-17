import { NextResponse } from 'next/server';
import dbConnect from '@/libs/dbConnect';
import HotelRoom from '@/models/HotelRoom';

export async function GET() {
    try {
        await dbConnect();
        const rooms = await HotelRoom.find({ isAvailable: true });
        
        return NextResponse.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rooms' },
            { status: 500 }
        );
    }
}
