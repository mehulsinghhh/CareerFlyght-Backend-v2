import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await authService.registerUser(
      req.body
    );

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  const result = await authService.loginUser(req.body);

  res.status(200).json({
    success: true,
    data: result,
  });
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