import { UserRole } from "@prisma/client";

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role: "student" | "mentor";
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}
