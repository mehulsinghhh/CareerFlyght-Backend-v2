import { Request, Response } from "express";
import { createMentorProfile, getMentorProfile, updateMentorProfile, getAllMentors, getMentorById } from "../services/mentor.service";
import { serializeBigInt } from "../utils/serialize";

export const createProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user.userId;

    const profile = await createMentorProfile(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: serializeBigInt(profile),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user.userId;

    const profile = await getMentorProfile(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: serializeBigInt(profile),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user.userId;

    const profile = await updateMentorProfile(
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      data: serializeBigInt(profile),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const getMentors = async (
  req: Request,
  res: Response
) => {
  try {
    const { company, minExperience, maxRate } = req.query;

    const mentors = await getAllMentors(
      company as string,
      minExperience ? parseInt(minExperience as string) : undefined,
      maxRate ? parseFloat(maxRate as string) : undefined
    );

    res.status(200).json({
      success: true,
      data: serializeBigInt(mentors),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const getMentor = async (
    req: Request,
    res: Response
) => {
    try {
        const mentor = await getMentorById(req.params.id as string);

        res.status(200).json({
            success: true,
            data: serializeBigInt(mentor),
        });
    } catch (error: any) {
        if (error.message === "Mentor not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
