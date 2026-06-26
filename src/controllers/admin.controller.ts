import { Request, Response, NextFunction } from "express";
import { getMentorsByStatus, updateMentorApprovalStatus } from "../services/admin.service";
import { serializeBigInt } from "../utils/serialize";
import { MentorApprovalStatus } from "@prisma/client";
import { AppError } from "../utils/app-error";

export const getMentors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = req.query.status as MentorApprovalStatus;

    if (status && !Object.values(MentorApprovalStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }

    const mentors = await getMentorsByStatus(status);

    res.status(200).json({
      success: true,
      data: serializeBigInt(mentors),
    });
  } catch (error) {
    next(error);
  }
};

export const updateMentorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mentorId } = req.params;
    const { status, reviewNotes } = req.body;
    const adminId = req.user?.userId;

    if (!status || !Object.values(MentorApprovalStatus).includes(status)) {
      throw new AppError("Invalid approval status", 400);
    }

    const mentor = await updateMentorApprovalStatus(
      mentorId as string,
      status,
      adminId as string,
      reviewNotes
    );

    res.status(200).json({
      success: true,
      message: `Mentor status updated to ${status}`,
      data: serializeBigInt(mentor),
    });
  } catch (error) {
    next(error);
  }
};
