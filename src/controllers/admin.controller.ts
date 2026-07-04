import { Request, Response, NextFunction } from "express";
import {
  getMentorsByStatus,
  updateMentorApprovalStatus,
  getDashboardStats,
  getStudents as getStudentsService,
  getStudentById,
  getStudentBookings as getStudentBookingsService,
  getAdminMentorById,
  getBookings as getBookingsService,
  getBookingById
} from "../services/admin.service";
import { serializeBigInt } from "../utils/serialize";
import { MentorApprovalStatus } from "@prisma/client";
import { AppError } from "../utils/app-error";

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({
      success: true,
      data: serializeBigInt(stats),
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const student = await getStudentById(studentId as string);

    res.status(200).json({
      success: true,
      data: serializeBigInt(student),
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const bookings = await getStudentBookingsService(studentId as string);

    res.status(200).json({
      success: true,
      data: serializeBigInt(bookings),
    });
  } catch (error) {
    next(error);
  }
};

export const getMentorDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mentorId } = req.params;
    const mentor = await getAdminMentorById(mentorId as string);

    res.status(200).json({
      success: true,
      data: serializeBigInt(mentor),
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { totalItems, bookings } = await getBookingsService(page, limit);

    res.status(200).json({
      success: true,
      data: serializeBigInt(bookings),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const booking = await getBookingById(bookingId as string);

    res.status(200).json({
      success: true,
      data: serializeBigInt(booking),
    });
  } catch (error) {
    next(error);
  }
};

export const getMentors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = req.query.status as MentorApprovalStatus;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (status && !Object.values(MentorApprovalStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }

    const { totalItems, mentors } = await getMentorsByStatus(status, page, limit);

    res.status(200).json({
      success: true,
      data: serializeBigInt(mentors),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingMentors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { totalItems, mentors } = await getMentorsByStatus(
      MentorApprovalStatus.PENDING,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      data: serializeBigInt(mentors),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const approveMentor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mentorId } = req.params;
    const adminId = req.user?.userId;

    const mentor = await updateMentorApprovalStatus(
      mentorId as string,
      MentorApprovalStatus.APPROVED,
      adminId as string
    );

    res.status(200).json({
      success: true,
      message: "Mentor approved successfully",
      data: serializeBigInt(mentor),
    });
  } catch (error) {
    next(error);
  }
};

export const rejectMentor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mentorId } = req.params;
    const { reason } = req.body;
    const adminId = req.user?.userId;

    const mentor = await updateMentorApprovalStatus(
      mentorId as string,
      MentorApprovalStatus.REJECTED,
      adminId as string,
      reason
    );

    res.status(200).json({
      success: true,
      message: "Mentor rejected successfully",
      data: serializeBigInt(mentor),
    });
  } catch (error) {
    next(error);
  }
};

export const updateMentorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mentorId } = req.params;
    const { status, reviewNotes } = req.body;
    const adminId = req.user?.userId;

    if (!status || !Object.values(MentorApprovalStatus).includes(status)) {
      throw new AppError("Invalid approval status", 400);
    }

    const mentor = await updateMentorApprovalStatus(
      mentorId as string,
      status,
      adminId as string,
      reviewNotes
    );

    res.status(200).json({
      success: true,
      message: `Mentor status updated to ${status}`,
      data: serializeBigInt(mentor),
    });
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { totalItems, students } = await getStudentsService(page, limit);

    res.status(200).json({
      success: true,
      data: serializeBigInt(students),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
