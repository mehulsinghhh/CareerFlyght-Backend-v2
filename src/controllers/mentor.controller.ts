import { Request, Response, NextFunction } from "express";
import { createMentorProfile, getMentorProfile, updateMentorProfile } from "../services/mentor.service";
import { serializeBigInt } from "../utils/serialize";
import { getAllMentors } from "../services/mentor.service";
import { getMentorById } from "../services/mentor.service";
import { AppError } from "../utils/app-error";

export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    const profile =
      await createMentorProfile(
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


export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    const profile =
      await getMentorProfile(userId);

    if (!profile) {
      throw new AppError("Mentor profile not found", 404);
    }

    res.status(200).json({
      success: true,
      data: serializeBigInt(profile),
    });
  } catch (error) {
    next(error);
  }
};



export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    const profile =
      await updateMentorProfile(
        userId,
        req.body
      );

    res.status(200).json({
      success: true,
      data: serializeBigInt(profile),
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
    const mentors = await getAllMentors(
  req.query.company as string,
  Number(req.query.minExperience),
  Number(req.query.maxRate)
);

    res.status(200).json({
  success: true,
  data: serializeBigInt(mentors),
});

  } catch (error) {
    next(error);
  }
};



export const getMentor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id as string;

        try {
            BigInt(id);
        } catch (e) {
            throw new AppError("Invalid mentor ID", 400);
        }

        const mentor = await getMentorById(id);

        res.status(200).json({
            success: true,
            data: serializeBigInt(mentor),
        });
    } catch (error) {
        next(error);
    }
};
