import { Request, Response } from "express";

export const healthCheck = (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    success: true,
    message: "CareerFlyht API running",
  });
};