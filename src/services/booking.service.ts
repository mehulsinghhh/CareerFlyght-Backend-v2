// src/services/booking.service.ts

import prisma from "../config/prisma";
import { CreateBookingDto } from "../types/booking.types";
import { BookingStatus } from "@prisma/client";
import { AppError } from "../utils/app-error";

export const createBooking = async (
  userId: string,
  data: CreateBookingDto
) => {

  const studentProfile =
    await prisma.studentProfile.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });

  if (!studentProfile) {
    throw new AppError("Student profile not found", 404);
  }

  const mentorProfile =
    await prisma.mentorProfile.findUnique({
      where: {
        id: BigInt(data.mentorId),
      },
    });

  if (!mentorProfile || mentorProfile.approvalStatus !== "APPROVED") {
    throw new AppError("Mentor not found or not approved", 404);
  }

  const booking =
    await prisma.booking.create({
      data: {
        studentId: studentProfile.id,
        mentorId: mentorProfile.id,
        bookingDate: new Date(data.bookingDate),
        bookingTime: data.bookingTime,
        sessionType: data.sessionType,
        notes: data.notes,

        amount: mentorProfile.hourlyRate,
      },
    });

  return booking;
};


export const getStudentBookings = async (userId: string) => {
  const studentProfile =
    await prisma.studentProfile.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });

  if (!studentProfile) {
    throw new AppError("Student profile not found", 404);
  }

  return prisma.booking.findMany({
    where: {
      studentId: studentProfile.id,
    },
    include: {
      mentor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};


export const getMentorBookings = async (userId: string) => {
  const mentorProfile =
    await prisma.mentorProfile.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });

  if (!mentorProfile) {
    throw new AppError("Mentor profile not found", 404);
  }

  return prisma.booking.findMany({
    where: {
      mentorId: mentorProfile.id,
    },
    include: {
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};



export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  userId: string,
  role: string
) => {
  if (role !== "mentor") {
    throw new AppError("Forbidden", 403);
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: BigInt(bookingId),
    },
    include: {
      mentor: true,
    },
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.mentor.userId !== BigInt(userId)) {
    throw new AppError("Forbidden", 403);
  }

  return prisma.booking.update({
    where: {
      id: BigInt(bookingId),
    },
    data: {
      status,
    },
  });
};
