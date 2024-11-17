'use client';

import React, { useEffect, useState } from 'react';
import HotelRoom from '@/types/HotelRoom';

interface RoomSelectionProps {
    onSelectRoom: (room: HotelRoom) => void;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({onSelectRoom}) => {
    const [rooms, setRooms] = useState<HotelRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('/api/rooms');
                if (!response.ok) {
                    throw new Error('Failed to fetch rooms');
                }
                const data = await response.json();
                setRooms(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load rooms');
                console.error('Error fetching rooms:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!rooms.length) {
        return (
            <div className="text-center text-gray-600 p-4">
                No rooms available at the moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rooms.map((room, index) => (
                <div key={index} className="border dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-xl font-bold dark:text-white">{room.roomType}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{room.description}</p>
                    <div className="mt-3 space-y-2">
                        <p className="text-lg font-semibold dark:text-white">${room.price}/night</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {room.bedsCount} {room.bedsCount === 1 ? 'bed' : 'beds'} • Max {room.maxOccupancy} guests
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Size:</span> {room.size}m²
                        </div>
                        {room.amenities && room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity, index) => (
                                    <span 
                                        key={index}
                                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => onSelectRoom(room)}
                        className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!room.isAvailable}
                    >
                        {room.isAvailable ? 'Select Room' : 'Not Available'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default RoomSelection;