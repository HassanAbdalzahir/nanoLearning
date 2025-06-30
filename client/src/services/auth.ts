import { User } from "@/models/User";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  specialization?: string;
  experience?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
}

class AuthService {
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
      credentials: "include",
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

    const data = await response.json();
    // Handle server response format: { success: true, data: [...] }
    return data.data || data;
  }

  // Authentication methods
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token in localStorage
    this.setToken(response.token);
    this.setUser(response.user);

    return response;
  }

  async signupStudent(
    data: Omit<
      SignupData,
      "role" | "specialization" | "experience" | "bio" | "website" | "linkedin"
    >
  ): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/signup/student", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token in localStorage
    this.setToken(response.token);
    this.setUser(response.user);

    return response;
  }

  async signupTeacher(data: SignupData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/signup/teacher", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token in localStorage
    this.setUser(response.user);
    this.setToken(response.token);

    return response;
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>(
      "/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );

    return response;
  }

  async verifyResetCode(
    email: string,
    resetCode: string
  ): Promise<{ valid: boolean }> {
    const response = await this.request<{ valid: boolean }>(
      "/auth/verify-reset-code",
      {
        method: "POST",
        body: JSON.stringify({ email, resetCode }),
      }
    );

    return response;
  }

  async resetPassword(
    email: string,
    resetCode: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    const response = await this.request<{ success: boolean }>(
      "/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({ email, resetCode, newPassword }),
      }
    );

    return response;
  }

  // Token management
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  // User management
  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }

  // Authentication state
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Logout
  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  // Get auth headers for authenticated requests
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
