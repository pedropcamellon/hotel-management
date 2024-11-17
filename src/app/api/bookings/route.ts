import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import HotelRoom from "@/models/HotelRoom";
import Booking from "@/models/Booking";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Validate required fields
        const { roomType, checkInDate, checkOutDate, guestCount } = body;
        if (!roomType || !checkInDate || !checkOutDate || !guestCount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate dates
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (checkIn < now) {
            return NextResponse.json({ error: "Check-in date cannot be in the past" }, { status: 400 });
        }

        if (checkOut <= checkIn) {
            return NextResponse.json({ error: "Check-out date must be after check-in date" }, { status: 400 });
        }

        // Find an available room of the requested type
        const availableRooms = await HotelRoom.find({
            roomType: roomType.toLowerCase(),
            isAvailable: true
        });

        if (!availableRooms.length) {
            return NextResponse.json({
                error: `No available rooms of type ${roomType} for the selected dates`
            }, { status: 400 });
        }

        // Check each room's availability for the requested dates
        let selectedRoom = null;

        for (const room of availableRooms) {
            const existingBookings = await Booking.find({
                roomId: room._id,
                status: { $ne: 'cancelled' },
                $or: [
                    {
                        checkInDate: { $lt: checkOut },
                        checkOutDate: { $gt: checkIn }
                    }
                ]
            });

            if (!existingBookings.length) {
                selectedRoom = room;
                break;
            }
        }

        if (!selectedRoom) {
            return NextResponse.json({
                error: `No available rooms of type ${roomType} for the selected dates`
            }, { status: 400 });
        }

        // Validate guest count
        if (guestCount < 1 || guestCount > selectedRoom.maxOccupancy) {
            return NextResponse.json({
                error: `Guest count must be between 1 and ${selectedRoom.maxOccupancy}`
            }, { status: 400 });
        }

        // Calculate total price
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = selectedRoom.price * nights;

        // Create booking
        const booking = await Booking.create({
            userId: session.user.id,
            roomId: selectedRoom._id,
            roomType: selectedRoom.roomType,
            roomNumber: selectedRoom.roomNumber,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guestCount,
            specialRequests: body.specialRequests,
            status: 'confirmed',
            totalPrice
        });

        return NextResponse.json({
            checkInDate: booking.checkInDate.toISOString(),
            checkOutDate: booking.checkOutDate.toISOString(),
            guestCount: booking.guestCount,
            roomNumber: booking.roomNumber,
            roomType: booking.roomType,
            specialRequests: booking.specialRequests,
            status: booking.status,
            totalPrice: booking.totalPrice
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create booking' },
            { status: 500 }
        );
    }
}