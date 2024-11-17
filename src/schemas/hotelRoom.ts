import {Schema} from "mongoose";
import IHotelRoom from "@/types/HotelRoom";

const roomTypes = [
    {title: "Basic", value: "basic"},
    {title: "Luxury", value: "luxury"},
    {title: "Suite", value: "suite"},
];

const hotelRoomSchema = new Schema<IHotelRoom>({
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    roomType: {
        type: String,
    },
    bedsCount: {
        type: Number,
    },
});

export default hotelRoomSchema;
