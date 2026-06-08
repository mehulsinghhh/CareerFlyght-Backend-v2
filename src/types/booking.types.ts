// src/types/booking.types.ts

export interface CreateBookingDto {
  mentorId: number;
  bookingDate: string;
  bookingTime: string;
  sessionType: "online" | "offline";
  notes?: string;
}