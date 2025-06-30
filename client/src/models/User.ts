export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher";
  specialization?: string;
  experience?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  specialization: string;
  experience?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
}
