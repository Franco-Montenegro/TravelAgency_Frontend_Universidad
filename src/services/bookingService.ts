import { api } from './api';
import type { Booking, CreateBookingPayload } from '../interfaces/booking.interface';

export const bookingService = {
  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings/', payload); 
    return response.data;
  },
  
  getUserHistory: async (userId: number): Promise<Booking[]> => {
    const response = await api.get<Booking[]>(`/bookings/user/${userId}`);
    return response.data;
  }
};