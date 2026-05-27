import { api } from './api';
import type { Payment, PaymentRequest } from '../interfaces/payment.interface';

export const paymentService = {
  processBookingPayment: async (bookingId: number, cardData: PaymentRequest): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/booking/${bookingId}`, cardData);
    return response.data;
  }
};