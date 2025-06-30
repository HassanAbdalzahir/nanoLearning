"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";

import { Footer } from "@/components/Footer";

import { authViewModel } from "@/viewmodels/AuthViewModel";

import { enrollmentViewModel } from "@/viewmodels/EnrollmentViewModel";

import { User } from "@/models/User";

import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [themeKey, setThemeKey] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize auth viewmodel
    authViewModel.initialize();

    // Check authentication status
    const checkAuth = () => {
      const authStatus = authViewModel.isAuthenticated();
      const currentUser = authViewModel.user;
      console.log("Dashboard - Auth check:", { authStatus, currentUser });
      setIsAuthenticated(authStatus);
      setUser(currentUser);
      // Only set loading to false for non-students
      if (!authStatus || currentUser?.role !== "student") {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const unsubscribeAuth = authViewModel.subscribe(() => {
      const authStatus = authViewModel.isAuthenticated();
      const currentUser = authViewModel.user;
      console.log("Dashboard - Auth state changed:", {
        authStatus,
        currentUser,
      });
      setIsAuthenticated(authStatus);
      setUser(currentUser);
      if (!authStatus || currentUser?.role !== "student") {
        setIsLoading(false);
      }
    });

    // Load enrollments if student
    if (
      authViewModel.isAuthenticated() &&
      authViewModel.user?.role === "student"
    ) {
      enrollmentViewModel.loadEnrollments();
    }

    // Initialize theme state
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialIsDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(initialIsDark);

    // Listen for theme changes to trigger re-render
    const handleThemeChange = (event: CustomEvent) => {
      setIsDark(event.detail.isDark);
      setThemeKey((prev) => prev + 1);
    };

    // Also listen for storage changes (in case theme is changed from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue;
        setIsDark(newTheme === "dark");
        setThemeKey((prev) => prev + 1);
      }
    };

    window.addEventListener("themeChange", handleThemeChange as EventListener);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribeAuth();
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Subscribe to enrollment viewmodel and control loading for students
  useEffect(() => {
    if (isAuthenticated && user?.role === "student") {
      const unsubscribe = enrollmentViewModel.subscribe(() => {
        // Set loading to false when enrollments are done loading
        if (!enrollmentViewModel.isLoading) {
          setIsLoading(false);
        }
      });
      // If enrollments already loaded, set loading to false
      if (!enrollmentViewModel.isLoading) {
        setIsLoading(false);
      }
      return unsubscribe;
    }
  }, [isAuthenticated, user?.role]);

  const handleViewCourse = (enrollmentId: string) => {
    router.push(`/dashboard/course/${enrollmentId}`);
  };

  const handleContinueLearning = (enrollmentId: string) => {
    router.push(`/dashboard/course/${enrollmentId}`);
  };

  if (!isAuthenticated && !isLoading) {
    router.push("/signin");
    return null;
  }

  // Redirect teachers to /instructor
  if (user?.role === "teacher") {
    router.push("/instructor");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const enrollments = enrollmentViewModel.enrollments;
  const isLoadingEnrollment = enrollmentViewModel.isLoading;

  // Calculate dashboard stats
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progress === 100).length;
  const inProgressCourses = enrollments.filter(
    (e) => e.progress > 0 && e.progress < 100
  ).length;
  const averageProgress =
    totalCourses > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses
        )
      : 0;

  return (
    <div
      key={themeKey}
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />

      {/* Enhanced Hero Section */}
      <section
        className="relative overflow-hidden py-16 lg:py-20"
        style={{
          backgroundColor: isDark ? "#1e293b" : "#f8fafc",
        }}
      >
        {/* Content Container - properly positioned */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-3xl md:text-5xl font-bold mb-4 relative z-20"
              style={{
                color: isDark ? "#ffffff" : "#111827",
              }}
            >
              Welcome back,{" "}
              <span
                className="relative z-20"
                style={{
                  color: "#3b82f6",
                }}
              >
                {user?.firstName}!
              </span>
            </h1>
            <p
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-20"
              style={{
                color: isDark ? "#d1d5db" : "#4b5563",
              }}
            >
              Continue your learning journey and track your progress
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
            }}
          >
            <div className="flex items-center">
              <div
                className="p-4 rounded-2xl"
                style={{ backgroundColor: isDark ? "#1e40af" : "#dbeafe" }}
              >
                <BookOpen
                  className="w-7 h-7"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                />
              </div>
              <div className="ml-4">
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  Total Courses
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  {totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
            }}
          >
            <div className="flex items-center">
              <div
                className="p-4 rounded-2xl"
                style={{ backgroundColor: isDark ? "#166534" : "#dcfce7" }}
              >
                <CheckCircle
                  className="w-7 h-7"
                  style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                />
              </div>
              <div className="ml-4">
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  Completed
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  {completedCourses}
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
            }}
          >
            <div className="flex items-center">
              <div
                className="p-4 rounded-2xl"
                style={{ backgroundColor: isDark ? "#92400e" : "#fef3c7" }}
              >
                <Play
                  className="w-7 h-7"
                  style={{ color: isDark ? "#fbbf24" : "#d97706" }}
                />
              </div>
              <div className="ml-4">
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  In Progress
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  {inProgressCourses}
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
            }}
          >
            <div className="flex items-center">
              <div
                className="p-4 rounded-2xl"
                style={{ backgroundColor: isDark ? "#7c3aed" : "#f3e8ff" }}
              >
                <TrendingUp
                  className="w-7 h-7"
                  style={{ color: isDark ? "#a78bfa" : "#9333ea" }}
                />
              </div>
              <div className="ml-4">
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  Avg Progress
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  {averageProgress}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced My Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                My Courses
              </h2>
              <p
                className="text-lg"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                Continue where you left off
              </p>
            </div>
            <button
              onClick={() => router.push("/courses")}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "#ffffff",
                boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
              }}
            >
              <span>Browse More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isLoadingEnrollment ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p
                className="mt-4 text-lg"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                Loading your courses...
              </p>
            </div>
          ) : enrollments.length === 0 ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: isDark ? "#374151" : "#e5e7eb" }}
              >
                <BookOpen
                  className="w-10 h-10"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                />
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                No courses enrolled yet
              </h3>
              <p
                className="mb-8 text-lg max-w-md mx-auto"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                Start your learning journey by enrolling in your first course
              </p>
              <button
                onClick={() => router.push("/courses")}
                className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  color: "#ffffff",
                  boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
                }}
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrollments.map((enrollment) => {
                const lessons = enrollment.courseId.lessons || [];
                const totalLessons = lessons.length;
                const completedLessonsCount =
                  enrollment.completedLessons.length;
                const clientProgress =
                  totalLessons > 0
                    ? Math.round((completedLessonsCount / totalLessons) * 100)
                    : 0;
                return (
                  <div
                    key={enrollment._id}
                    className="group rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
                    style={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      border: isDark
                        ? "1px solid #334155"
                        : "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Enhanced Course Image */}
                    <div className="relative h-48">
                      {enrollment.courseId.coverImage ? (
                        <img
                          src={enrollment.courseId.coverImage}
                          alt={enrollment.courseId.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                          <Play className="w-16 h-16 text-white opacity-90" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white opacity-90" />
                      </div>
                      {/* Enhanced Progress Badge */}
                      <div
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white backdrop-blur-sm ${
                          clientProgress === 100
                            ? "bg-green-500/90"
                            : "bg-blue-500/90"
                        }`}
                      >
                        {clientProgress}% Complete
                      </div>
                    </div>

                    {/* Enhanced Course Content */}
                    <div className="p-6">
                      <h3
                        className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
                        style={{ color: isDark ? "#ffffff" : "#111827" }}
                      >
                        {enrollment.courseId.title}
                      </h3>

                      <p
                        className="text-sm mb-4 line-clamp-2"
                        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                      >
                        {enrollment.courseId.description}
                      </p>

                      <p
                        className="text-sm mb-6 font-medium"
                        style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                      >
                        {enrollment.courseId.instructorId ? (
                          <>
                            by {enrollment.courseId.instructorId.firstName}{" "}
                            {enrollment.courseId.instructorId.lastName}
                          </>
                        ) : null}
                      </p>

                      {/* Enhanced Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: isDark ? "#d1d5db" : "#374151" }}
                          >
                            Progress
                          </span>
                          <span
                            className="text-lg font-bold"
                            style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                          >
                            {clientProgress}%
                          </span>
                        </div>
                        <div
                          className="relative w-full rounded-full h-3 overflow-hidden"
                          style={{
                            backgroundColor: isDark ? "#374151" : "#f3f4f6",
                          }}
                        >
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              clientProgress === 100
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-blue-500 to-purple-600"
                            }`}
                            style={{ width: `${clientProgress}%` }}
                          ></div>
                        </div>
                        <div
                          className="mt-2 text-xs text-center"
                          style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                        >
                          {completedLessonsCount} / {totalLessons} lessons
                          completed
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex space-x-3">
                        {clientProgress === 100 ? (
                          <button
                            onClick={() => handleViewCourse(enrollment._id)}
                            className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                            style={{
                              background:
                                "linear-gradient(135deg, #10b981, #059669)",
                              color: "#ffffff",
                              boxShadow:
                                "0 4px 14px 0 rgba(16, 185, 129, 0.25)",
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Review Course</span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleContinueLearning(enrollment._id)
                            }
                            className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                            style={{
                              background:
                                "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                              color: "#ffffff",
                              boxShadow:
                                "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
                            }}
                          >
                            <Play className="w-4 h-4" />
                            <span>Continue Learning</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Welcome to your learning dashboard!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Keep up the great work on your learning journey!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
