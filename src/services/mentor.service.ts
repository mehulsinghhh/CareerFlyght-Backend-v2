import prisma from "../config/prisma";
import { CreateMentorProfileDto } from "../types/mentor.types";

export const createMentorProfile = async (
  userId: string,
  data: CreateMentorProfileDto
) => {
  const existingProfile =
    await prisma.mentorProfile.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });

  if (existingProfile) {
    throw new Error("Profile already exists");
  }

  const profile =
    await prisma.mentorProfile.create({
      data: {
        userId: BigInt(userId),
        company: data.company,
        designation: data.designation,
        experienceYears: data.experienceYears,
        bio: data.bio,
        linkedinUrl: data.linkedinUrl,
        hourlyRate: data.hourlyRate,
      },
    });

  return profile;
};


export const getMentorProfile = async (
  userId: string
) => {
  const profile =
    await prisma.mentorProfile.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });

  return profile;
};


export const updateMentorProfile = async (
  userId: string,
  data: any
) => {
  const profile =
    await prisma.mentorProfile.update({
      where: {
        userId: BigInt(userId),
      },
      data,
    });

  return profile;
};



export const getAllMentors = async (
  company?: string,
  minExperience?: number,
  maxRate?: number
) => {
  const where: any = {};

  if (company) {
    where.company = company;
  }

  if (minExperience) {
    where.experienceYears = {
      gte: minExperience,
    };
  }

  if (maxRate) {
    where.hourlyRate = {
      lte: maxRate.toString(),
    };
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
  });
};



export const getMentorById = async (mentorId: string) => {
    const mentor = await prisma.mentorProfile.findUnique({
        where: {
            id: BigInt(mentorId),
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

    if (!mentor) {
        throw new Error("Mentor not found");
    }

    return mentor;
};



