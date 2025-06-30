import { User, CreateUserData, UpdateUserData } from "@/models/User";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface StudentSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface TeacherSignupData {
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

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Authentication endpoints
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signupStudent(data: StudentSignupData): Promise<AuthResponse> {
    return this.request("/auth/signup/student", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signupTeacher(data: TeacherSignupData): Promise<AuthResponse> {
    return this.request("/auth/signup/teacher", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Health check
  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
  }> {
    return this.request("/health");
  }

  // User endpoints
  async getUsers(): Promise<{ users: User[] }> {
    return this.request("/users");
  }

  async getUserById(id: string): Promise<{ user: User }> {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: CreateUserData): Promise<{ user: User }> {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: string,
    userData: UpdateUserData
  ): Promise<{ user: User }> {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
