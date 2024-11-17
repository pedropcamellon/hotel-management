import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import dbConnect from "@/libs/dbConnect";
import Booking from "@/models/Booking";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only allow users to view their own bookings
        if (session.user.id !== params.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        const bookings = await Booking.find({ userId: params.id })
            .sort({ createdAt: -1 }) // Most recent first
            .lean();

        // Remove sensitive information from the response
        bookings.forEach((booking) => {
            delete booking._id;
            delete booking.userId;
        });

        return NextResponse.json(bookings);
    } catch (error: any) {
        console.error('Error fetching user bookings:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
