import { authService } from "@/services/auth";
import { User } from "@/models/User";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "student" | "teacher";
  specialization?: string;
  experience?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export class AuthViewModel {
  private state: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  // State management
  getState(): AuthState {
    return { ...this.state };
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Getters
  get user(): User | null {
    return this.state.user;
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get error(): string | null {
    return this.state.error;
  }

  // Initialize user from localStorage
  initialize(): void {
    const user = authService.getUser();
    const token = authService.getToken();
    this.setState({
      user,
      token,
    });
  }

  // Validation methods
  validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  }

  validatePassword(password: string): string | null {
    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    return null;
  }

  validateConfirmPassword(
    password: string,
    confirmPassword: string
  ): string | null {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  }

  validateName(name: string, fieldName: string): string | null {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2)
      return `${fieldName} must be at least 2 characters long`;
    return null;
  }

  validateSignupData(data: SignupFormData): string | null {
    const firstNameError = this.validateName(data.firstName, "First name");
    if (firstNameError) return firstNameError;

    const lastNameError = this.validateName(data.lastName, "Last name");
    if (lastNameError) return lastNameError;

    const emailError = this.validateEmail(data.email);
    if (emailError) return emailError;

    const passwordError = this.validatePassword(data.password);
    if (passwordError) return passwordError;

    const confirmPasswordError = this.validateConfirmPassword(
      data.password,
      data.confirmPassword
    );
    if (confirmPasswordError) return confirmPasswordError;

    if (data.role === "teacher" && !data.specialization) {
      return "Specialization is required for teachers";
    }

    return null;
  }

  validateLoginData(data: LoginFormData): string | null {
    const emailError = this.validateEmail(data.email);
    if (emailError) return emailError;

    const passwordError = this.validatePassword(data.password);
    if (passwordError) return passwordError;

    return null;
  }

  // Authentication methods
  async login(data: LoginFormData): Promise<void> {
    const validationError = this.validateLoginData(data);
    if (validationError) {
      this.setState({ error: validationError });
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const response = await authService.login(data);
      this.setState({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      this.setState({
        isLoading: false,
        error: error.message || "Login failed",
      });
    }
  }

  async signupStudent(
    data: Omit<
      SignupFormData,
      "role" | "specialization" | "experience" | "bio" | "website" | "linkedin"
    >
  ): Promise<void> {
    const validationError = this.validateSignupData({
      ...data,
      role: "student",
    });
    if (validationError) {
      this.setState({ error: validationError });
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const response = await authService.signupStudent(data);
      this.setState({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      this.setState({
        isLoading: false,
        error: error.message || "Signup failed",
      });
    }
  }

  async signupTeacher(data: SignupFormData): Promise<void> {
    const validationError = this.validateSignupData(data);
    if (validationError) {
      this.setState({ error: validationError });
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const response = await authService.signupTeacher(data);
      this.setState({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      this.setState({
        isLoading: false,
        error: error.message || "Signup failed",
      });
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const emailError = this.validateEmail(email);
    if (emailError) {
      this.setState({ error: emailError });
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      await authService.requestPasswordReset(email);
      this.setState({
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      this.setState({
        isLoading: false,
        error: error.message || "Failed to request password reset",
      });
    }
  }

  async verifyResetCode(email: string, resetCode: string): Promise<boolean> {
    if (!resetCode || resetCode.length !== 6) {
      this.setState({ error: "Please enter a valid 6-digit code" });
      return false;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const response = await authService.verifyResetCode(email, resetCode);
      this.setState({ isLoading: false, error: null });
      return response.valid;
    } catch (error: any) {
      this.setState({
        isLoading: false,
        error: error.message || "Failed to verify reset code",
      });
      return false;
    }
  }

  async resetPassword(
    email: string,
    resetCode: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> {
    const passwordError = this.validatePassword(newPassword);
    if (passwordError) {
      this.setState({ error: passwordError });
      return false;
    }

    const confirmPasswordError = this.validateConfirmPassword(
      newPassword,
      confirmPassword
    );
    if (confirmPasswordError) {
      this.setState({ error: confirmPasswordError });
      return false;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const response = await authService.resetPassword(
        email,
        resetCode,
        newPassword
      );
      this.setState({ isLoading: false, error: null });
      return response.success;
    } catch (error: any) {
      this.setState({
        isLoading: false,
        error: error.message || "Failed to reset password",
      });
      return false;
    }
  }

  logout(): void {
    authService.logout();
    this.setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  }

  clearError(): void {
    this.setState({ error: null });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return authService.isAuthenticated();
  }

  // Get current user
  getCurrentUser(): User | null {
    return authService.getUser();
  }
}

export const authViewModel = new AuthViewModel();
