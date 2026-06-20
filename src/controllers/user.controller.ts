import { Request, Response } from "express";
import prisma from "../config/prisma";
import { createStudentProfile, upsertStudentProfile }
from "../services/student.service";
export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(userId),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        profilePhoto: true,
        createdAt: true,
      },
    });

    res.status(200).json({
  success: true,
  data: {
    ...user,
    id: user?.id.toString(),
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};



export const createProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const profile =
      await createStudentProfile(
        userId,
        req.body
      );

    res.status(201).json({
      success: true,
      data: {
        ...profile,
        id: profile.id.toString(),
        userId: profile.userId.toString(),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const getStudentProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const profile = await prisma.studentProfile.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });

    res.status(200).json({
  success: true,
  data: {
    ...profile,
    id: profile?.id.toString(),
    userId: profile?.userId.toString(),
  },
});
  } catch (error) {
  console.log(error);

  res.status(500).json({
    success: false,
    message: "Failed to fetch profile",
  });
}
};



export const updateStudentProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const profile = await upsertStudentProfile(
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      data: {
        ...profile,
        id: profile.id.toString(),
        userId: profile.userId.toString(),
      },
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};