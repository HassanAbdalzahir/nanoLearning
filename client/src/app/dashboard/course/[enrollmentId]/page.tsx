"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  ChevronRight,
} from "lucide-react";
import { authViewModel } from "@/viewmodels/AuthViewModel";
import { enrollmentViewModel } from "@/viewmodels/EnrollmentViewModel";
import { lessonViewModel } from "@/viewmodels/LessonViewModel";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params.enrollmentId as string;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [themeKey, setThemeKey] = useState(0);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    // Initialize auth viewmodel
    authViewModel.initialize();

    // Check authentication status
    const checkAuth = () => {
      const authStatus = authViewModel.isAuthenticated();
      const currentUser = authViewModel.user;
      console.log("Course Detail - Auth check:", { authStatus, currentUser });
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();

    // Subscribe to auth changes
    const unsubscribeAuth = authViewModel.subscribe(() => {
      const authStatus = authViewModel.isAuthenticated();
      const currentUser = authViewModel.user;
      console.log("Course Detail - Auth state changed:", {
        authStatus,
        currentUser,
      });
      setIsAuthenticated(authStatus);
    });

    // Load enrollment details and lessons
    if (authViewModel.isAuthenticated() && enrollmentId) {
      enrollmentViewModel.loadEnrollmentDetails(enrollmentId);
      // For students, load lessons by enrollment
      lessonViewModel.loadLessonsByEnrollment(enrollmentId);
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
  }, [enrollmentId]);

  // Subscribe to viewmodels
  useEffect(() => {
    const unsubscribeEnrollment = enrollmentViewModel.subscribe(() => {
      forceUpdate((n) => n + 1);
    });
    const unsubscribeLesson = lessonViewModel.subscribe(() => {
      forceUpdate((n) => n + 1);
    });

    return () => {
      unsubscribeEnrollment();
      unsubscribeLesson();
    };
  }, []);

  if (!isAuthenticated && !isLoading) {
    router.push("/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const enrollment = enrollmentViewModel.enrollments.find(
    (e) => e._id === enrollmentId
  );
  const course = enrollment?.courseId;
  const lessons = lessonViewModel.lessons;
  const isLoadingLessons = lessonViewModel.isLoading;
  const lessonsError = lessonViewModel.error;

  // Debug logging
  console.log("CourseDetailPage:", {
    enrollmentId,
    lessons,
    isLoadingLessons,
    lessonsError,
    enrollment: enrollment
      ? {
          _id: enrollment._id,
          courseId: enrollment.courseId._id,
          progress: enrollment.progress,
        }
      : null,
  });

  if (!enrollment || !course) {
    return (
      <div
        key={themeKey}
        className="min-h-screen transition-colors duration-200"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BookOpen
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            />
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Course Not Found
            </h2>
            <p
              className="mb-6"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              The course you&apos;re looking for doesn&apos;t exist or
              you&apos;re not enrolled.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate progress on the client (after enrollment is defined)
  const totalLessons = lessons.length;
  const completedLessonsCount = lessons.filter((l) =>
    enrollment.completedLessons.includes(l._id)
  ).length;
  const clientProgress =
    totalLessons > 0
      ? Math.round((completedLessonsCount / totalLessons) * 100)
      : 0;

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div
      key={themeKey}
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 mb-6 font-medium transition-colors"
          style={{
            color: isDark ? "#9ca3af" : "#4b5563",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                {course.title}
              </h1>
              <p
                className="text-lg mb-4"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                {course.description}
              </p>
              <div
                className="flex items-center gap-4 text-sm"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                {course.instructorId ? (
                  <span>
                    by {course.instructorId.firstName}{" "}
                    {course.instructorId.lastName}
                  </span>
                ) : null}
                <span>•</span>
                <span className="capitalize">{course.category}</span>
                <span>•</span>
                <span className="capitalize">{course.type}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: "#3b82f6" }}>
                {clientProgress}%
              </div>
              <div
                className="text-sm"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                Complete
              </div>
            </div>
          </div>

          {/* Course Cover Image */}
          {course.coverImage && (
            <div className="mt-6 rounded-xl overflow-hidden">
              <Image
                src={course.coverImage}
                alt={course.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-base font-semibold"
                style={{ color: isDark ? "#e5e7eb" : "#374151" }}
              >
                Course Progress
              </span>
              <span className="text-lg font-bold" style={{ color: "#3b82f6" }}>
                {clientProgress}%
              </span>
            </div>
            <div
              className="relative w-full rounded-full h-5 shadow-sm"
              style={{
                backgroundColor: isDark ? "#374151" : "#e5e7eb",
                border: isDark ? "1px solid #4b5563" : "1px solid #d1d5db",
              }}
            >
              <div
                className="h-5 rounded-full transition-all duration-300"
                style={{
                  width: `${clientProgress}%`,
                  backgroundColor: "#3b82f6",
                }}
              ></div>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-white drop-shadow">
                {clientProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl shadow-lg p-6"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
              }}
            >
              <div
                className="border-b pb-4 mb-4 flex items-center justify-between"
                style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Course Content ({lessons.length} lessons)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lessonsError ? (
                  <div
                    className="col-span-full mb-4 p-4 rounded-lg border"
                    style={{
                      backgroundColor: isDark ? "#7f1d1d" : "#fef2f2",
                      color: isDark ? "#fca5a5" : "#dc2626",
                      borderColor: isDark ? "#991b1b" : "#fecaca",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>Error loading lessons:</strong> {lessonsError}
                      </div>
                      <button
                        onClick={() =>
                          lessonViewModel.loadLessonsByEnrollment(enrollmentId)
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : isLoadingLessons ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p
                      className="mt-2"
                      style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                    >
                      Loading lessons...
                    </p>
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <BookOpen
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
                    />
                    <p style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                      No lessons available yet.
                    </p>
                  </div>
                ) : (
                  lessons.map((lesson) => (
                    <Link
                      key={lesson._id}
                      href={`/dashboard/course/${enrollmentId}/lesson/${lesson._id}`}
                      className="group relative rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-transparent hover:border-blue-400 block"
                      style={{
                        background: isDark
                          ? "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)"
                          : "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)",
                      }}
                    >
                      <div className="flex items-center gap-4 p-5">
                        <div className="flex-shrink-0">
                          {lesson.contentType === "video" ? (
                            <div
                              className="p-3 rounded-full"
                              style={{
                                backgroundColor: isDark ? "#1e40af" : "#dbeafe",
                              }}
                            >
                              <Video
                                className="w-6 h-6"
                                style={{
                                  color: isDark ? "#60a5fa" : "#2563eb",
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              className="p-3 rounded-full"
                              style={{
                                backgroundColor: isDark ? "#166534" : "#dcfce7",
                              }}
                            >
                              <FileText
                                className="w-6 h-6"
                                style={{
                                  color: isDark ? "#4ade80" : "#16a34a",
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-lg font-semibold transition-colors line-clamp-1"
                            style={{ color: isDark ? "#ffffff" : "#111827" }}
                          >
                            Lesson {lesson.order}: {lesson.title}
                          </h3>
                          <p
                            className="text-sm mt-1 line-clamp-2"
                            style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
                          >
                            {lesson.description}
                          </p>
                        </div>
                        <ChevronRight
                          className="w-5 h-5 transition-transform"
                          style={{ color: isDark ? "#60a5fa" : "#3b82f6" }}
                        />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Course Info Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="rounded-lg shadow-sm p-6"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Course Information
              </h3>

              <div className="space-y-4">
                <div>
                  <h4
                    className="text-sm font-medium mb-2"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Enrollment Date
                  </h4>
                  <p style={{ color: isDark ? "#ffffff" : "#111827" }}>
                    {new Date(enrollment.enrolledAt).toLocaleDateString(
                      "en-US"
                    )}
                  </p>
                </div>

                <div>
                  <h4
                    className="text-sm font-medium mb-2"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Last Accessed
                  </h4>
                  <p style={{ color: isDark ? "#ffffff" : "#111827" }}>
                    {enrollment.lastAccessedAt
                      ? new Date(enrollment.lastAccessedAt).toLocaleDateString(
                          "en-US"
                        )
                      : "Not yet accessed"}
                  </p>
                </div>

                <div>
                  <h4
                    className="text-sm font-medium mb-2"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Course Type
                  </h4>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: isDark ? "#1e40af" : "#dbeafe",
                      color: isDark ? "#60a5fa" : "#2563eb",
                    }}
                  >
                    {course.type}
                  </span>
                </div>

                <div>
                  <h4
                    className="text-sm font-medium mb-2"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Category
                  </h4>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: isDark ? "#374151" : "#f3f4f6",
                      color: isDark ? "#d1d5db" : "#374151",
                    }}
                  >
                    {course.category}
                  </span>
                </div>

                {course.price && course.price > 0 && (
                  <div>
                    <h4
                      className="text-sm font-medium mb-2"
                      style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                    >
                      Price
                    </h4>
                    <p
                      className="font-semibold"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      ${course.price}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
