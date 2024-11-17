"use client";

import { Booking } from "@/models/Booking";
import { FC } from "react";
import { useRouter } from "next/navigation";

type Props = {
  bookingDetails: Booking[];
};

const Table: FC<Props> = ({ bookingDetails }) => {
  const router = useRouter();

  return (
    <div className="overflow-x-auto max-w-[340px] rounded-lg mx-auto md:max-w-full shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Room name</th>
            <th className="px-6 py-3">Unit Price</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Discount</th>
            <th className="px-6 py-3">No. Days Booked</th>
            <th className="px-6 py-3">Days Left</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {bookingDetails.map((booking) => (
            <tr
              key={booking._id}
              className="bg-white border-b hover:bg-gray-50"
            >
              <th
                onClick={() =>
                  router.push(`/rooms/${booking.hotelRoom.slug.current}`)
                }
                className="px-6 underline text-blue-600 cursor-pointer py-4 font-medium whitespace-nowrap"
              >
                {booking.hotelRoom.name}
              </th>
              <td className="px-6 py-4">{booking.hotelRoom.price}</td>
              <td className="px-6 py-4">{booking.totalPrice}</td>
              <td className="px-6 py-4">{booking.discount}</td>
              <td className="px-6 py-4">{booking.numberOfDays}</td>
              <td className="px-6 py-4">0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
