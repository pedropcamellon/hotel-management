import mongoose from 'mongoose';

interface IBooking {
    userId: string;
    roomId: mongoose.Types.ObjectId;  // Reference to HotelRoom's _id
    roomType: string;  // Added roomType field
    roomNumber: string;  // Store room number for easy reference
    checkInDate: Date;
    checkOutDate: Date;
    guestCount: number;
    specialRequests?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    totalPrice: number;
}

const BookingSchema = new mongoose.Schema<IBooking>({
    userId: {
        type: String,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HotelRoom',
        required: true
    },
    roomType: {
        type: String,
        required: true,
        enum: ['standard', 'deluxe', 'suite']
    },
    roomNumber: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    guestCount: {
        type: Number,
        required: true,
        min: 1
    },
    specialRequests: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
BookingSchema.index({ roomId: 1, status: 1 });
BookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
BookingSchema.index({ userId: 1 });

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;