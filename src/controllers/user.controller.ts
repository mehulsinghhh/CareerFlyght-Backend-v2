import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { createStudentProfile, upsertStudentProfile }
from "../services/student.service";
import { AppError } from "../utils/app-error";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
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

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
  success: true,
  data: {
    ...user,
    id: user?.id.toString(),
  },
});
  } catch (error) {
    next(error);
  }
};



export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
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
  } catch (error) {
    next(error);
  }
};



export const getStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    const profile = await prisma.studentProfile.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });

    if (!profile) {
      throw new AppError("Student profile not found", 404);
    }

    res.status(200).json({
  success: true,
  data: {
    ...profile,
    id: profile?.id.toString(),
    userId: profile?.userId.toString(),
  },
});
  } catch (error) {
    next(error);
  }
};



export const updateStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    next(error);
  }
};
