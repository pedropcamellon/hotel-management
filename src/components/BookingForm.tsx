"use client";

import React, { useState } from 'react';
import HotelRoom from "@/types/HotelRoom";
import { BookingRequest } from "@/types/Booking";
import { useSession } from "next-auth/react";
import { toast } from 'react-hot-toast';

interface BookingFormProps {
    isLoading: boolean;
    onBookRoom: (booking: BookingRequest) => void;
    room: HotelRoom;
}

const BookingForm: React.FC<BookingFormProps> = ({ room, onBookRoom, isLoading }) => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guestCount, setGuestCount] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');

    const { data: session } = useSession();

    const validateDates = (checkInDate: Date, checkOutDate: Date): boolean => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of day

        const checkInTime = new Date(checkInDate);
        checkInTime.setHours(0, 0, 0, 0);

        const checkOutTime = new Date(checkOutDate);
        checkOutTime.setHours(0, 0, 0, 0);

        if (checkInTime < now) {
            toast.error('Check-in date cannot be in the past');
            return false;
        }

        if (checkOutTime <= checkInTime) {
            toast.error('Check-out date must be after check-in date');
            return false;
        }

        return true;
    };

    const validateGuestCount = (count: number): boolean => {
        if (count < 1) {
            toast.error('Guest count must be at least 1');
            return false;
        }

        if (count > room.maxOccupancy) {
            toast.error(`Maximum occupancy for this room is ${room.maxOccupancy} guests`);
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user?.id) {
            toast.error('Please login to book a room');
            return;
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Client-side validation
        if (!validateDates(checkInDate, checkOutDate)) {
            return;
        }

        if (!validateGuestCount(guestCount)) {
            return;
        }

        onBookRoom({
            userId: session.user.id,
            roomType: room.roomType,
            checkInDate,
            checkOutDate,
            guestCount,
            specialRequests: specialRequests || undefined
        });
    };

    // Calculate minimum date (today) for check-in
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate minimum date for check-out (day after check-in)
    const minCheckOut = checkIn 
        ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
        : today;

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Check-in Date
                </label>
                <input
                    type="date"
                    id="checkIn"
                    value={checkIn}
                    onChange={(e) => {
                        setCheckIn(e.target.value);
                        // Reset checkout if it's before new checkin
                        const newCheckIn = new Date(e.target.value);
                        const currentCheckOut = checkOut ? new Date(checkOut) : null;
                        if (currentCheckOut && currentCheckOut <= newCheckIn) {
                            setCheckOut('');
                        }
                    }}
                    min={today}
                    required
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
            </div>
            <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Check-out Date
                </label>
                <input
                    type="date"
                    id="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={minCheckOut}
                    required
                    disabled={!checkIn}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                />
                {!checkIn && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Please select a check-in date first
                    </p>
                )}
            </div>
            <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Number of Guests
                </label>
                <input
                    type="number"
                    id="guestCount"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.min(Math.max(1, parseInt(e.target.value)), room.maxOccupancy))}
                    min={1}
                    max={room.maxOccupancy}
                    required
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Maximum occupancy: {room.maxOccupancy} guests
                </p>
            </div>
            <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Special Requests (Optional)
                </label>
                <textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Any special requests or preferences?"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !checkIn || !checkOut}
                className={`w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center ${isLoading ? 'cursor-wait' : ''}`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    'Book Now'
                )}
            </button>
        </form>
    );
};

export default BookingForm;