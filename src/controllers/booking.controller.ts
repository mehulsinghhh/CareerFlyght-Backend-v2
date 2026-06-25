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
    
    const userId = (req as any).user?.userId;

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
    const userId = (req as any).user?.userId;

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
    const userId = (req as any).user?.userId;

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
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;

    const booking = await updateBookingStatus(
      req.params.bookingId as string,
      req.body.status as BookingStatus,
      userId,
      role
    );

    res.status(200).json({
      success: true,
      data: serializeBigInt(booking),
    });
  } catch (error: any) {
    let statusCode = 400;
    if (error.message === "Forbidden") {
      statusCode = 403;
    } else if (error.message === "Booking not found") {
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};