"use client";

import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Booking {
    _id: string;
    roomType: string;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    totalPrice: number;
    status: string;
    specialRequests?: string;
}

export default function UserDetails({ params }: { params: { id: string } }) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session?.user?.id) {
            router.push('/login');
            return;
        }

        // Only allow users to view their own bookings
        if (session.user.id !== params.id) {
            router.push('/');
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await fetch(`/api/users/${params.id}/bookings`);
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [params.id, router, session]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                type="button"
                className="flex items-center"
                onClick={() => signOut({ callbackUrl: "/" })}
            >
                <p className="mr-2">Sign Out</p>
                <FaSignOutAlt className="text-3xl cursor-pointer" />
            </button>

            <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                    <p>You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold dark:text-white">
                                        {booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)} Room
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">Room {booking.roomNumber}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                                    <p className="font-medium dark:text-white">
                                        {new Date(booking.checkInDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                                    <p className="font-medium dark:text-white">
                                        {new Date(booking.checkOutDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Guests</p>
                                    <p className="font-medium dark:text-white">{booking.guestCount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                                    <p className="font-medium dark:text-white">${booking.totalPrice}</p>
                                </div>
                            </div>

                            {booking.specialRequests && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Special Requests</p>
                                    <p className="text-gray-800 dark:text-gray-200">{booking.specialRequests}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
