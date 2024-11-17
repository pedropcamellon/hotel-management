require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// 10 rooms: 4 standard, 4 deluxe, 2 suites
const rooms = [
    // Standard Rooms (101-104)
    {
        roomNumber: '101',
        roomType: 'standard',
        price: 100,
        description: 'Comfortable standard room with city view',
        bedsCount: 1,
        maxOccupancy: 2,
        amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Fridge'],
        images: ['standard-room-1.jpg'],
        isAvailable: true,
        size: 25
    },
    {
        roomNumber: '102',
        roomType: 'standard',
        price: 100,
        description: 'Cozy standard room with garden view',
        bedsCount: 1,
        maxOccupancy: 2,
        amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Fridge'],
        images: ['standard-room-2.jpg'],
        isAvailable: true,
        size: 25
    },
    {
        roomNumber: '103',
        roomType: 'standard',
        price: 100,
        description: 'Charming standard room with pool view',
        bedsCount: 2,
        maxOccupancy: 2,
        amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Fridge'],
        images: ['standard-room-3.jpg'],
        isAvailable: true,
        size: 25
    },
    {
        roomNumber: '104',
        roomType: 'standard',
        price: 100,
        description: 'Pleasant standard room with garden view',
        bedsCount: 2,
        maxOccupancy: 2,
        amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Fridge'],
        images: ['standard-room-4.jpg'],
        isAvailable: true,
        size: 25
    },
    // Deluxe Rooms (201-204)
    {
        roomNumber: '201',
        roomType: 'deluxe',
        price: 200,
        description: 'Spacious deluxe room with panoramic city view',
        bedsCount: 2,
        maxOccupancy: 4,
        amenities: ['Wi-Fi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Work Desk', 'Lounge Area'],
        images: ['deluxe-room-1.jpg'],
        isAvailable: true,
        size: 35
    },
    {
        roomNumber: '202',
        roomType: 'deluxe',
        price: 200,
        description: 'Elegant deluxe room with pool view',
        bedsCount: 2,
        maxOccupancy: 4,
        amenities: ['Wi-Fi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Work Desk', 'Lounge Area'],
        images: ['deluxe-room-2.jpg'],
        isAvailable: true,
        size: 35
    },
    {
        roomNumber: '203',
        roomType: 'deluxe',
        price: 200,
        description: 'Modern deluxe room with city view',
        bedsCount: 2,
        maxOccupancy: 4,
        amenities: ['Wi-Fi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Work Desk', 'Lounge Area'],
        images: ['deluxe-room-3.jpg'],
        isAvailable: true,
        size: 35
    },
    {
        roomNumber: '204',
        roomType: 'deluxe',
        price: 200,
        description: 'Luxurious deluxe room with garden view',
        bedsCount: 2,
        maxOccupancy: 4,
        amenities: ['Wi-Fi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Work Desk', 'Lounge Area'],
        images: ['deluxe-room-4.jpg'],
        isAvailable: true,
        size: 35
    },
    // Suite Rooms (301-302)
    {
        roomNumber: '301',
        roomType: 'suite',
        price: 300,
        description: 'Luxurious suite with separate living area and stunning views',
        bedsCount: 1,
        maxOccupancy: 3,
        amenities: ['Wi-Fi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Work Desk', 'Living Room', 'Kitchenette', 'Premium Toiletries'],
        images: ['suite-room-1.jpg'],
        isAvailable: true,
        size: 50
    },
    {
        roomNumber: '302',
        roomType: 'suite',
        price: 300,
        description: 'Premium suite with panoramic views and luxury amenities',
        bedsCount: 1,
        maxOccupancy: 3,
        amenities: ['Wi-Fi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Work Desk', 'Living Room', 'Kitchenette', 'Premium Toiletries'],
        images: ['suite-room-2.jpg'],
        isAvailable: true,
        size: 50
    }
];

async function seedRooms() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get or create HotelRoom model
        const HotelRoomSchema = new mongoose.Schema({
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

        const HotelRoom = mongoose.models.HotelRoom || mongoose.model('HotelRoom', HotelRoomSchema);

        // Clear existing rooms
        await HotelRoom.deleteMany({});
        console.log('Cleared existing rooms');

        // Insert new rooms
        await HotelRoom.insertMany(rooms);
        console.log('Inserted new rooms');

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedRooms();
