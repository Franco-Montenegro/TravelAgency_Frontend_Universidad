import type { Booking } from './booking.interface';

export interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  paymentDate: string;
  cardNumber: string;
  cardHolderName: string;
  booking: Booking;
}

export interface PaymentRequest {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}