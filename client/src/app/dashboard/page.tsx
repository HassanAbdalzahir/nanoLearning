"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { authViewModel } from "@/viewmodels/AuthViewModel";
import { enrollmentViewModel } from "@/viewmodels/EnrollmentViewModel";

export default function DashboardPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth viewmodel
    authViewModel.initialize();

    // Check authentication status
    const checkAuth = () => {
      setIsAuthenticated(authViewModel.isAuthenticated());
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleAuthChange);

    // Check theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setIsDark(event.detail.theme === "dark");
    };

    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        setIsDark(e.newValue === "dark");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    // Load enrollments
    const loadEnrollments = async () => {
      try {
        setIsLoading(true);
        await enrollmentViewModel.loadEnrollments();
      } catch (error) {
        console.error("Error loading enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadEnrollments();
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleViewCourse = (enrollmentId: string) => {
    router.push(`/dashboard/course/${enrollmentId}`);
  };

  const handleContinueLearning = (enrollmentId: string) => {
    router.push(`/dashboard/course/${enrollmentId}`);
  };

  const handleBrowseCourses = () => {
    router.push("/courses");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const enrollments = enrollmentViewModel.enrollments;
  const viewModelLoading = enrollmentViewModel.isLoading;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome back!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Continue your learning journey where you left off.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Enrolled Courses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enrollments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enrollments.filter((e) => e.progress === 100).length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    enrollments.filter(
                      (e) => e.progress > 0 && e.progress < 100
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Progress
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enrollments.length > 0
                    ? Math.round(
                        enrollments.reduce((acc, e) => acc + e.progress, 0) /
                          enrollments.length
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Courses
            </h2>
            <button
              onClick={handleBrowseCourses}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Browse More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {viewModelLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                No courses enrolled yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start your learning journey by enrolling in a course
              </p>
              <button
                onClick={handleBrowseCourses}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
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
                        <Image
                          src={enrollment.courseId.coverImage}
                          alt={enrollment.courseId.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
