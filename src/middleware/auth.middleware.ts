import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("Token missing");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    (req as any).user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};



export const me = async (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};