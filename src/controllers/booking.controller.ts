import { Request, Response, NextFunction } from "express";
import { createBooking, getStudentBookings, getMentorBookings } from "../services/booking.service";
import { serializeBigInt } from "../utils/serialize";
import { updateBookingStatus } from "../services/booking.service";
import { BookingStatus } from "@prisma/client";

export const createBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
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
  } catch (error) {
    next(error);
  }
};


export const getMyBookingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;

    const bookings = await getStudentBookings(userId);

    res.status(200).json({
      success: true,
      data: serializeBigInt(bookings),
    });
  } catch (error) {
    next(error);
  }
};


export const getMentorBookingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;

    const bookings =
      await getMentorBookings(userId);

    res.status(200).json({
      success: true,
      data: serializeBigInt(bookings),
    });
  } catch (error) {
    next(error);
  }
};



export const updateBookingStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
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
  } catch (error) {
    next(error);
  }
};
