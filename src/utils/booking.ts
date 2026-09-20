import { Booking } from '../types';

export function hasBookingConflict(
  bookings: Booking[],
  roomId: string,
  date: string,
  startTime: string,
  endTime: string
) {
  return bookings.some((booking) => {
    if (booking.roomId !== roomId) {
      return false;
    }

    if (booking.date !== date) {
      return false;
    }

    return (
      startTime < booking.endTime &&
      endTime > booking.startTime
    );
  });
}