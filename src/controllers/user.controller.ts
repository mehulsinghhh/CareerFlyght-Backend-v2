import { Request, Response } from "express";
import prisma from "../config/prisma";

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