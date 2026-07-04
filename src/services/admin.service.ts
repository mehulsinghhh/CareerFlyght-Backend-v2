import prisma from "../config/prisma";
import { MentorApprovalStatus } from "@prisma/client";
import { AppError } from "../utils/app-error";
import { DashboardStats } from "../types/admin.types";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  profilePhoto: true,
  createdAt: true,
};

const STUDENT_INCLUDE = {
  user: {
    select: USER_SELECT,
  },
};

const MENTOR_INCLUDE = {
  user: {
    select: USER_SELECT,
  },
};

const BOOKING_INCLUDE = {
  student: {
    include: STUDENT_INCLUDE,
  },
  mentor: {
    include: MENTOR_INCLUDE,
  },
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [
    totalStudents,
    totalMentors,
    pendingMentors,
    approvedMentors,
    rejectedMentors,
    totalBookings,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.mentorProfile.count(),
    prisma.mentorProfile.count({ where: { approvalStatus: MentorApprovalStatus.PENDING } }),
    prisma.mentorProfile.count({ where: { approvalStatus: MentorApprovalStatus.APPROVED } }),
    prisma.mentorProfile.count({ where: { approvalStatus: MentorApprovalStatus.REJECTED } }),
    prisma.booking.count(),
  ]);

  return {
    totalStudents,
    totalMentors,
    pendingMentors,
    approvedMentors,
    rejectedMentors,
    totalBookings,
  };
};

export const getMentorsByStatus = async (
  status?: MentorApprovalStatus,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;
  const where: any = {};
  if (status) {
    where.approvalStatus = status;
  }

  const [totalItems, mentors] = await Promise.all([
    prisma.mentorProfile.count({ where }),
    prisma.mentorProfile.findMany({
      where,
      include: MENTOR_INCLUDE,
      orderBy: {
        id: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    totalItems,
    mentors,
  };
};

export const getStudents = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [totalItems, students] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.studentProfile.findMany({
      include: STUDENT_INCLUDE,
      orderBy: {
        id: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    totalItems,
    students,
  };
};

export const updateMentorApprovalStatus = async (
  mentorId: string,
  status: MentorApprovalStatus,
  adminId: string,
  reviewNotes?: string
) => {
  const mentor = await prisma.mentorProfile.findUnique({
    where: { id: BigInt(mentorId) },
  });

  if (!mentor) {
    throw new AppError("Mentor not found", 404);
  }

  return prisma.mentorProfile.update({
    where: { id: BigInt(mentorId) },
    data: {
      approvalStatus: status,
      reviewNotes: reviewNotes || null,
      reviewedBy: BigInt(adminId),
      reviewedAt: new Date(),
    },
    include: MENTOR_INCLUDE,
  });
};

export const getStudentById = async (studentId: string) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: BigInt(studentId) },
    include: STUDENT_INCLUDE,
  });

  if (!student) {
    throw new AppError("Student profile not found", 404);
  }

  return student;
};

export const getStudentBookings = async (studentId: string) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: BigInt(studentId) },
  });

  if (!student) {
    throw new AppError("Student profile not found", 404);
  }

  return prisma.booking.findMany({
    where: { studentId: BigInt(studentId) },
    include: {
      mentor: {
        include: MENTOR_INCLUDE,
      },
    },
    orderBy: {
      bookingDate: "desc",
    },
  });
};

export const getAdminMentorById = async (mentorId: string) => {
  const mentor = await prisma.mentorProfile.findUnique({
    where: { id: BigInt(mentorId) },
    include: MENTOR_INCLUDE,
  });

  if (!mentor) {
    throw new AppError("Mentor profile not found", 404);
  }

  return mentor;
};

export const getBookings = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [totalItems, bookings] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.findMany({
      include: BOOKING_INCLUDE,
      orderBy: {
        id: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    totalItems,
    bookings,
  };
};

export const getBookingById = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: BigInt(bookingId) },
    include: BOOKING_INCLUDE,
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  return booking;
};
