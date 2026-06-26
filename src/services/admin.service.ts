import prisma from "../config/prisma";
import { MentorApprovalStatus } from "@prisma/client";
import { AppError } from "../utils/app-error";

export const getMentorsByStatus = async (status?: MentorApprovalStatus) => {
  const where: any = {};
  if (status) {
    where.approvalStatus = status;
  }

  return prisma.mentorProfile.findMany({
    where,
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
    orderBy: {
      id: "desc",
    },
  });
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
        },
      },
    },
  });
};
