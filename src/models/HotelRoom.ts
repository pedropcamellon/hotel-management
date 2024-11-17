import mongoose from 'mongoose';

interface IHotelRoom {
    roomNumber: string;  // e.g., "101", "102", etc.
    roomType: 'standard' | 'deluxe' | 'suite';
    price: number;
    description: string;
    bedsCount: number;
    maxOccupancy: number;
    amenities: string[];
    images: string[];
    isAvailable: boolean;
    size: number;
}

interface IHotelRoomMethods {
    checkAvailability(checkIn: Date, checkOut: Date): Promise<boolean>;
}

type HotelRoomModel = mongoose.Model<IHotelRoom, {}, IHotelRoomMethods>;

const HotelRoomSchema = new mongoose.Schema<IHotelRoom, HotelRoomModel, IHotelRoomMethods>({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    roomType: {
        type: String,
        enum: ['standard', 'deluxe', 'suite'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    bedsCount: {
        type: Number,
        required: true,
        min: 1
    },
    maxOccupancy: {
        type: Number,
        required: true,
        min: 1
    },
    amenities: [{
        type: String,
        required: true
    }],
    images: [{
        type: String,
        required: true
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    size: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
});

// Add method to check room availability
HotelRoomSchema.methods.checkAvailability = async function(checkIn: Date, checkOut: Date): Promise<boolean> {
    const Booking = mongoose.models.Booking || mongoose.model('Booking');
    
    const existingBooking = await Booking.findOne({
        roomId: this._id,  // Using MongoDB's auto-generated _id
        status: { $ne: 'cancelled' },
        $or: [
            {
                checkInDate: { $lte: checkOut },
                checkOutDate: { $gte: checkIn }
            }
        ]
    });

    return !existingBooking;
};

const HotelRoom = mongoose.models.HotelRoom as HotelRoomModel || mongoose.model<IHotelRoom, HotelRoomModel>('HotelRoom', HotelRoomSchema);

export default HotelRoom;
