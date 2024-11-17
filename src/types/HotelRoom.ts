export default interface HotelRoom {
    _id: string;
    roomType: 'standard' | 'deluxe' | 'suite';
    roomNumber: string;
    price: number;
    description: string;
    bedsCount: number;
    maxOccupancy: number;
    amenities: string[];
    images: string[];
    isAvailable: boolean;
    size: number; // in square meters/feet
}
