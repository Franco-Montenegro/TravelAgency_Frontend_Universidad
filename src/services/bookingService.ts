import { api } from './api';

export interface CreateBookingPayload {
  passengersCount: number;
  user: {
    id: number;
  };
  tourPackage: {
    id: number;
  };
}

export const bookingService = {
  createBooking: async (payload: CreateBookingPayload) => {
    const response = await api.post('/bookings/', payload); 
    return response.data;
  }
};