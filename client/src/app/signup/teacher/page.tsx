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
  BookOpen,
  Briefcase,
  GraduationCap,
  XCircle,
} from "lucide-react";

export default function TeacherSignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    experience: "",
    bio: "",
    website: "",
    linkedin: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      role: "teacher",
      specialization: formData.specialization,
      experience: formData.experience || undefined,
      bio: formData.bio || undefined,
      website: formData.website || undefined,
      linkedin: formData.linkedin || undefined,
    });

    if (validationError) {
      setValidationErrors({ general: validationError });
      return;
    }

    // Attempt signup
    await authViewModel.signupTeacher({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: "teacher",
      specialization: formData.specialization,
      experience: formData.experience || undefined,
      bio: formData.bio || undefined,
      website: formData.website || undefined,
      linkedin: formData.linkedin || undefined,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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

  // Redirect on successful signup
  useEffect(() => {
    if (authState.user && authState.token) {
      router.push("/dashboard");
    }
  }, [authState.user, authState.token, router]);

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    isPasswordMatch &&
    formData.specialization;

  const specializations = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "UI/UX Design",
    "DevOps",
    "Cybersecurity",
    "Digital Marketing",
    "Business",
    "Finance",
    "Health & Fitness",
    "Music",
    "Photography",
    "Other",
  ];

  const experienceLevels = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                }}
              >
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2
              className="text-3xl font-bold"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Become a Teacher
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Share your expertise and inspire learners worldwide
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
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          borderColor: isDark ? "#374151" : "#d1d5db",
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                        placeholder="First name"
                      />
                    </div>
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
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          borderColor: isDark ? "#374151" : "#d1d5db",
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
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
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors"
                      style={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="specialization"
                      className="block text-sm font-medium mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Specialization *
                    </label>
                    <div className="relative">
                      <BookOpen
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                      />
                      <select
                        id="specialization"
                        name="specialization"
                        required
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors appearance-none"
                        style={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          borderColor: isDark ? "#374151" : "#d1d5db",
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                      >
                        <option value="">Select your specialization</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Years of Experience
                    </label>
                    <div className="relative">
                      <Briefcase
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                      />
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors appearance-none"
                        style={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          borderColor: isDark ? "#374151" : "#d1d5db",
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                      >
                        <option value="">Select experience level</option>
                        {experienceLevels.map((exp) => (
                          <option key={exp} value={exp}>
                            {exp}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium mb-2"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
                    style={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      borderColor: isDark ? "#374151" : "#d1d5db",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                    placeholder="Tell us about your expertise and teaching experience..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Website (Optional)
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border transition-colors"
                      style={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      LinkedIn (Optional)
                    </label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border transition-colors"
                      style={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Account Security
                </h3>
                <div className="space-y-4">
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
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          borderColor: isDark ? "#374151" : "#d1d5db",
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
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
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          borderColor: isDark ? "#374151" : "#d1d5db",
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {getFieldError("confirmPassword") && (
                      <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
                        {getFieldError("confirmPassword")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300"
                style={{
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  borderColor: isDark ? "#374151" : "#d1d5db",
                }}
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium hover:underline"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium hover:underline"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isFormValid || authState.isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    !isFormValid || authState.isLoading ? "#6b7280" : "#2563eb",
                }}
              >
                {authState.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Teacher Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
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
                  Sign in here
                </Link>
              </p>
              <p
                className="text-sm mt-2"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                Want to learn instead?{" "}
                <Link
                  href="/signup"
                  className="font-medium hover:underline"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                >
                  Sign up as a student
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
