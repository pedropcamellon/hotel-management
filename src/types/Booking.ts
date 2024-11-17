export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingRequest {
    userId: string;
    roomType: string;
    checkInDate: Date;
    checkOutDate: Date;
    guestCount: number;
    specialRequests?: string;
}

export default interface Booking extends BookingRequest {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: BookingStatus;
    totalPrice: number;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    roomDetails: {
        roomType: string;
        price: number;
        roomNumber?: string;
    };
}