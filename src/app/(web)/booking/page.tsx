'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import HotelRoom from "@/types/HotelRoom";
import { BookingRequest } from "@/types/Booking";
import RoomSelection from '@/components/RoomSelection';
import BookingForm from '@/components/BookingForm';

const BookingPage: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const handleRoomSelect = (room: HotelRoom) => {
        setSelectedRoom(room);
    };

    const handleBookRoom = async (bookingData: BookingRequest) => {
        if (!session?.user?.id) {
            toast.error('Please login to book a room');
            router.push('/login');
            return;
        }

        if (!selectedRoom?.roomType) {
            toast.error('Please select a room first');
            return;
        }

        console.log(`Booking data: ${JSON.stringify(bookingData)}`);

        try {
            setIsLoading(true);
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...bookingData,
                    userId: session.user.id,
                    roomType: selectedRoom.roomType,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to book room');
            }

            toast.success('Room booked successfully!');
            router.push(`/users/${session.user.id}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to book room. Please try again.');
            console.error('Booking error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Book a Room</h1>
            {!selectedRoom ? (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Select a Room</h2>
                    <RoomSelection onSelectRoom={handleRoomSelect} />
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Complete Your Booking</h2>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                        <h3 className="text-xl font-bold">{selectedRoom.roomType}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{selectedRoom.description}</p>
                        <p className="text-lg font-semibold mt-2">${selectedRoom.price}/night</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Maximum occupancy: {selectedRoom.maxOccupancy} guests</p>
                        {selectedRoom.amenities && (
                            <div className="mt-2">
                                <h4 className="font-semibold">Amenities:</h4>
                                <ul className="list-disc list-inside">
                                    {selectedRoom.amenities.map((amenity, index) => (
                                        <li key={index} className="text-gray-600 dark:text-gray-300">{amenity}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <BookingForm
                        room={selectedRoom}
                        onBookRoom={handleBookRoom}
                        isLoading={isLoading}
                    />
                </>
            )}
        </div>
    );
};

export default BookingPage;