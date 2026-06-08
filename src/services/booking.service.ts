// src/services/booking.service.ts

import prisma from "../config/prisma";
import { CreateBookingDto } from "../types/booking.types";
import { BookingStatus } from "@prisma/client";
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
    throw new Error("Student profile not found");
  }

  const mentorProfile =
    await prisma.mentorProfile.findUnique({
      where: {
        id: BigInt(data.mentorId),
      },
    });

  if (!mentorProfile) {
    throw new Error("Mentor not found");
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
    throw new Error("Student profile not found");
  }

  return prisma.booking.findMany({
    where: {
      studentId: studentProfile.id,
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
    throw new Error("Mentor profile not found");
  }

  return prisma.booking.findMany({
    where: {
      mentorId: mentorProfile.id,
    },
    orderBy: {
      id: "desc",
    },
  });
};



export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
) => {
  return prisma.booking.update({
    where: {
      id: BigInt(bookingId),
    },
    data: {
      status,
    },
  });
};