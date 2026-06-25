import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
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
