import prisma from "../config/prisma";
import { MentorApprovalStatus } from "@prisma/client";
import { AppError } from "../utils/app-error";
import { DashboardStats } from "../types/admin.types";

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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            createdAt: true,
          },
        },
      },
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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            createdAt: true,
          },
        },
      },
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
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
    },
  });
};
