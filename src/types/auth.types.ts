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