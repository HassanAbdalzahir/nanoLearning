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
  ArrowLeft,
  ArrowRight,
  XCircle,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [authState, setAuthState] = useState(authViewModel.getState());

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

    // Subscribe to auth state changes
    const unsubscribe = authViewModel.subscribe(setAuthState);

    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});
    authViewModel.clearError();

    // Validate form data
    const validationError = authViewModel.validateLoginData(formData);

    if (validationError) {
      setValidationErrors({ general: validationError });
      return;
    }

    // Attempt login
    await authViewModel.login(formData);

    // Check if login was successful
    if (authState.user && authState.token) {
      // Redirect to dashboard page
      router.push("/dashboard");
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

  // Show auth error if any
  useEffect(() => {
    if (authState.error) {
      setValidationErrors({ general: authState.error });
    }
  }, [authState.error]);

  // Redirect on successful login
  useEffect(() => {
    if (authState.user && authState.token) {
      router.push("/dashboard");
    }
  }, [authState.user, authState.token, router]);

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <h2
              className="text-3xl font-bold"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Welcome back
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Sign in to your account to continue learning
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
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className="h-5 w-5 text-gray-400"
                      style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                    />
                  </div>
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className="h-5 w-5 text-gray-400"
                      style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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
                    placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    borderColor: isDark ? "#374151" : "#d1d5db",
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  authState.isLoading || !formData.email || !formData.password
                }
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    formData.email && formData.password && !authState.isLoading
                      ? "linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)"
                      : isDark
                      ? "#374151"
                      : "#9ca3af",
                }}
              >
                {authState.isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign in
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
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup/student"
                  className="font-medium hover:underline"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                >
                  Sign up as a student
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

          <div className="text-center">
            <p
              className="text-sm"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
