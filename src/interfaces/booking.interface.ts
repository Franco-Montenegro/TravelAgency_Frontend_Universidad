import type { TourPackage } from './package.interface';

export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED';

export interface Booking {
  id: number;
  passengersCount: number;
  bookingDate: string;
  expirationDate: string;
  totalAmount: number;
  stateBooking: BookingStatus;
  user: {
    id: number;
    email?: string;
  };
  tourPackage: TourPackage;
}

export interface CreateBookingPayload {
  passengersCount: number;
  user: {
    id: number;
  };
  tourPackage: {
    id: number;
  };
}