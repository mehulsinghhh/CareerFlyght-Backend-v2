import { Request, Response } from "express";
import { createMentorProfile, getMentorProfile, updateMentorProfile } from "../services/mentor.service";
import { serializeBigInt } from "../utils/serialize";
import { getAllMentors } from "../services/mentor.service";
import { getMentorById } from "../services/mentor.service";

export const createProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const profile =
      await createMentorProfile(
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


export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const profile =
      await getMentorProfile(userId);

    res.status(200).json({
  success: true,
  data: {
    ...profile,
    id: profile?.id.toString(),
    userId: profile?.userId.toString(),
  },
});

  } catch (error) {
  console.log("GET MENTOR PROFILE ERROR:", error);

  res.status(500).json({
    success: false,
    message: "Failed to get profile",
  });
}
};



export const updateProfile = async (
  req: Request,
  res: Response
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
    console.log(
      "UPDATE MENTOR PROFILE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};


export const getMentors = async (
  req: Request,
  res: Response
) => {
  try {
    const mentors = await getAllMentors();

    res.status(200).json({
  success: true,
  data: serializeBigInt(mentors),
});

  } catch (error) {
    console.log("GET MENTORS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get mentors",
    });
  }
};



export const getMentor = async (
    req: Request,
    res: Response
) => {
    try {
        const id = req.params.id as string;

        const mentor = await getMentorById(id);

        res.status(200).json({
            success: true,
            data: serializeBigInt(mentor),
        });
    } catch (error) {
        console.log("GET MENTOR ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get mentor",
        });
    }
};


