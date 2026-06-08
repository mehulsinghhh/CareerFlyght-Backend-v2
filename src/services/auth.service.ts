import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { RegisterUserDto } from "../types/auth.types";
import jwt from "jsonwebtoken";
import { LoginUserDto } from "../types/auth.types";

export const registerUser = async (
  data: RegisterUserDto
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(
    data.password,
    10
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return {
  ...user,
  id: user.id.toString(),
};
};






export const loginUser = async (
  data: LoginUserDto
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash || ""
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};