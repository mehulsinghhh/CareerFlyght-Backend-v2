import { Request, Response } from "express";
import { createBooking, getStudentBookings, getMentorBookings } from "../services/booking.service";
import { serializeBigInt } from "../utils/serialize";
import { updateBookingStatus } from "../services/booking.service";
import { BookingStatus } from "@prisma/client";

export const createBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const userId = req.user?.userId;

    const booking = await createBooking(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: serializeBigInt(booking),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyBookingsController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const bookings = await getStudentBookings(userId);

    res.status(200).json({
      success: true,
      data: serializeBigInt(bookings),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMentorBookingsController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const bookings =
      await getMentorBookings(userId);

    res.status(200).json({
      success: true,
      data: serializeBigInt(bookings),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateBookingStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const booking = await updateBookingStatus(
      req.params.bookingId as string,
      req.body.status as BookingStatus
    );

    res.status(200).json({
      success: true,
      data: serializeBigInt(booking),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};