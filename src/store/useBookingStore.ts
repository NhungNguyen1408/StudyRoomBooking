import { create } from 'zustand';
import { Booking, User } from '../types';

interface BookingState {
  user: User | null;
  bookings: Booking[];
  searchText: string;

  setUser: (user: User) => void;
  logout: () => void;

  setSearchText: (text: string) => void;

  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  user: null,
  bookings: [],
  searchText: '',

  setUser: (user) =>
    set({
      user,
    }),

  logout: () =>
    set({
      user: null,
    }),

  setSearchText: (text) =>
    set({
      searchText: text,
    }),

  addBooking: (booking) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
    })),

  cancelBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter(
        (booking) => booking.id !== id
      ),
    })),
}));