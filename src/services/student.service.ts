import prisma from "../config/prisma";
import { CreateStudentProfileDto } from "../types/student.types";

export const createStudentProfile = async (
  userId: string,
  data: CreateStudentProfileDto
) => {
  const existingProfile =
    await prisma.studentProfile.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });

  if (existingProfile) {
    throw new Error("Profile already exists");
  }

  const profile =
    await prisma.studentProfile.create({
      data: {
        userId: BigInt(userId),
        educationLevel: data.educationLevel,
        preferredCountry: data.preferredCountry,
        careerInterest: data.careerInterest,
        resumeUrl: data.resumeUrl,
        bio: data.bio,
      },
    });

  return profile;
};


