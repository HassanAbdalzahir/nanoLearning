"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { authViewModel } from "@/viewmodels/AuthViewModel";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  GraduationCap,
  XCircle,
} from "lucide-react";

export default function StudentSignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(savedTheme === "dark" || (!savedTheme && prefersDark));

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setIsDark(event.detail.isDark);
    };

    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});
    authViewModel.clearError();

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setValidationErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    // Validate form data
    const validationError = authViewModel.validateSignupData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: "student",
    });

    if (validationError) {
      setValidationErrors({ general: validationError });
      return;
    }

    // Attempt signup
    await authViewModel.signupStudent({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    // Check if signup was successful
    if (!authViewModel.error) {
      // Redirect to dashboard page
      router.push("/dashboard");
    } else {
      // Error is already set in the viewmodel
      setValidationErrors({ general: authViewModel.error || "Signup failed" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear validation errors when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }

    if (validationErrors.general) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors[fieldName];
  };

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    isPasswordMatch;

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)",
                }}
              >
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2
              className="text-3xl font-bold"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Sign Up as a Student
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Join nanoLearning and start your learning journey today
            </p>
          </div>

          {/* General Error Message */}
          {validationErrors.general && (
            <div
              className="flex items-center p-4 rounded-lg border"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#fef2f2",
                borderColor: isDark ? "#374151" : "#fecaca",
              }}
            >
              <XCircle className="w-5 h-5 mr-3" style={{ color: "#ef4444" }} />
              <span style={{ color: isDark ? "#fca5a5" : "#dc2626" }}>
                {validationErrors.general}
              </span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                    />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        getFieldError("firstName")
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: getFieldError("firstName")
                          ? "#ef4444"
                          : isDark
                          ? "#374151"
                          : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                      placeholder="First name"
                    />
                  </div>
                  {getFieldError("firstName") && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {getFieldError("firstName")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                    />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        getFieldError("lastName")
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: getFieldError("lastName")
                          ? "#ef4444"
                          : isDark
                          ? "#374151"
                          : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                      placeholder="Last name"
                    />
                  </div>
                  {getFieldError("lastName") && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {getFieldError("lastName")}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      getFieldError("email")
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      borderColor: getFieldError("email")
                        ? "#ef4444"
                        : isDark
                        ? "#374151"
                        : "#d1d5db",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                    placeholder="Enter your email"
                  />
                </div>
                {getFieldError("email") && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError("email")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      getFieldError("password")
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      borderColor: getFieldError("password")
                        ? "#ef4444"
                        : isDark
                        ? "#374151"
                        : "#d1d5db",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {getFieldError("password") && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError("password")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      getFieldError("confirmPassword")
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      borderColor: getFieldError("confirmPassword")
                        ? "#ef4444"
                        : isDark
                        ? "#374151"
                        : "#d1d5db",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {getFieldError("confirmPassword") && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError("confirmPassword")}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={authViewModel.isLoading || !isFormValid}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    isFormValid && !authViewModel.isLoading
                      ? "linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)"
                      : isDark
                      ? "#374151"
                      : "#9ca3af",
                }}
              >
                {authViewModel.isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <>
                    Create Student Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p
                className="text-sm"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium hover:underline"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p
                className="text-sm"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                Want to teach?{" "}
                <Link
                  href="/signup/teacher"
                  className="font-medium hover:underline"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                >
                  Sign up as a teacher
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
