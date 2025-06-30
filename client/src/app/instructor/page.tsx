"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { authViewModel } from "@/viewmodels/AuthViewModel";
import { courseViewModel } from "@/viewmodels/CourseViewModel";
import { lessonViewModel } from "@/viewmodels/LessonViewModel";
import {
  Course,
  CreateCourseData,
  UpdateCourseData,
} from "@/services/courseService";
import {
  Lesson,
  CreateLessonData,
  UpdateLessonData,
} from "@/services/lessonService";
import CourseCard from "@/components/CourseCard";
import CourseForm from "@/components/CourseForm";
import LessonForm from "@/components/LessonForm";
import DraggableLessonList from "@/components/DraggableLessonList";
import { Plus, ArrowLeft, BookOpen, Users, TrendingUp } from "lucide-react";

export default function InstructorDashboard() {
  const router = useRouter();
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [view, setView] = useState<"courses" | "lessons">("courses");
  const [isDark, setIsDark] = useState(false);
  const [themeKey, setThemeKey] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    // Initialize auth viewmodel
    authViewModel.initialize();

    // Check authentication status
    const checkAuth = () => {
      const authStatus = authViewModel.isAuthenticated();
      const currentUser = authViewModel.user;
      console.log("Instructor Dashboard - Auth check:", {
        authStatus,
        currentUser,
      });
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();

    // Subscribe to auth changes
    const unsubscribeAuth = authViewModel.subscribe(() => {
      const authStatus = authViewModel.isAuthenticated();
      const currentUser = authViewModel.user;
      console.log("Instructor Dashboard - Auth state changed:", {
        authStatus,
        currentUser,
      });
      setIsAuthenticated(authStatus);
    });

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

  // Subscribe to ViewModels
  useEffect(() => {
    const unsubscribeCourse = courseViewModel.subscribe(() => {
      // Force re-render when course data changes
      setUpdateTrigger((prev) => prev + 1);
    });
    const unsubscribeLesson = lessonViewModel.subscribe(() => {
      // Force re-render when lesson data changes
      setUpdateTrigger((prev) => prev + 1);
    });

    // Load initial data
    courseViewModel.loadCourses();
    courseViewModel.loadStats();

    return () => {
      unsubscribeCourse();
      unsubscribeLesson();
    };
  }, []);

  if (!isAuthenticated && !isLoading) {
    router.push("/signin");
    return null;
  }

  // Redirect non-teachers to appropriate pages
  if (authViewModel.user?.role === "student") {
    router.push("/dashboard");
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

  // Course handlers
  const handleCreateCourse = async (data: CreateCourseData) => {
    const success = await courseViewModel.createCourse(data);
    return success;
  };

  const handleUpdateCourse = async (data: UpdateCourseData) => {
    const success = await courseViewModel.updateCourse(
      editingCourse!._id,
      data
    );
    return success;
  };

  const handleDeleteCourse = async (courseId: string) => {
    const success = await courseViewModel.deleteCourse(courseId);
    return success;
  };

  const handleTogglePublish = async (courseId: string) => {
    const success = await courseViewModel.togglePublishStatus(courseId);
    return success;
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleManageLessons = async (courseId: string) => {
    const course = courseViewModel.courses.find((c) => c._id === courseId);
    if (course) {
      setSelectedCourse(course);
      setView("lessons");
      lessonViewModel.clearLessons();
      lessonViewModel.clearError();
      // Load lessons immediately without delay
      await lessonViewModel.loadLessonsByCourse(courseId);
    }
  };

  // Lesson handlers
  const handleCreateLesson = async (data: CreateLessonData) => {
    return await lessonViewModel.createLesson(data);
  };

  const handleUpdateLesson = async (data: UpdateLessonData) => {
    if (!editingLesson) return false;
    const success = await lessonViewModel.updateLesson(editingLesson._id, data);
    if (success && selectedCourse) {
      // Refresh lessons to update the list
      await lessonViewModel.loadLessonsByCourse(selectedCourse._id);
    }
    return success;
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const success = await lessonViewModel.deleteLesson(lessonId);
    if (success && selectedCourse) {
      // Refresh lessons to update the list
      await lessonViewModel.loadLessonsByCourse(selectedCourse._id);
    }
    return success;
  };

  const handleReorderLessons = async (
    lessonOrders: { lessonId: string; order: number }[]
  ) => {
    if (selectedCourse) {
      const success = await lessonViewModel.reorderLessons(
        selectedCourse._id,
        lessonOrders
      );
      if (success) {
        // Refresh lessons to update the list
        await lessonViewModel.loadLessonsByCourse(selectedCourse._id);
      }
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonForm(true);
  };

  const handleBackToCourses = () => {
    setView("courses");
    setSelectedCourse(null);
    lessonViewModel.clearLessons();
    // Don't automatically refresh courses - they should already be loaded
    // This prevents infinite loading loops
  };

  const stats = courseViewModel.stats;

  // Refresh data when view changes back to courses
  // useEffect(() => {
  //   if (view === "courses" && !courseViewModel.isLoading) {
  //     courseViewModel.loadCourses();
  //     courseViewModel.loadStats();
  //   }
  // }, [view]);

  if (view === "lessons" && selectedCourse) {
    return (
      <div
        key={`${themeKey}-${updateTrigger}`}
        className="min-h-screen transition-colors duration-200"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToCourses}
              className="flex items-center gap-2 mb-4 font-medium transition-colors"
              style={{ color: isDark ? "#9ca3af" : "#4b5563" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1
                  className="text-3xl font-bold"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  {selectedCourse.title}
                </h1>
                <p
                  className="mt-2"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  Manage lessons for this course
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingLesson(null);
                  setShowLessonForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                }}
              >
                <Plus className="w-4 h-4" />
                Add Lesson
              </button>
            </div>
          </div>

          {/* Lessons List */}
          <div
            className="rounded-lg shadow p-6"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Lessons ({lessonViewModel.lessons.length})
            </h2>

            {lessonViewModel.isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p
                  className="mt-2"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  Loading lessons...
                </p>
              </div>
            ) : lessonViewModel.lessons.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
                />
                <p style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                  No lessons yet. Create your first lesson!
                </p>
              </div>
            ) : (
              <DraggableLessonList
                lessons={lessonViewModel.lessons}
                onEdit={handleEditLesson}
                onDelete={handleDeleteLesson}
                onReorder={handleReorderLessons}
                isDark={isDark}
              />
            )}

            {lessonViewModel.error && (
              <div
                className="mt-4 p-4 rounded-md border"
                style={{
                  backgroundColor: isDark ? "#7f1d1d" : "#fef2f2",
                  borderColor: isDark ? "#991b1b" : "#fecaca",
                }}
              >
                <p style={{ color: isDark ? "#fca5a5" : "#dc2626" }}>
                  {lessonViewModel.error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Form Modal */}
        {showLessonForm && (
          <LessonForm
            lesson={editingLesson}
            courseId={selectedCourse._id}
            nextOrder={lessonViewModel.lessons.length + 1}
            onSubmit={async (data) => {
              if (
                "title" in data &&
                "contentType" in data &&
                "content" in data &&
                "description" in data &&
                "order" in data &&
                "courseId" in data
              ) {
                const success = editingLesson
                  ? await handleUpdateLesson(data)
                  : await handleCreateLesson(data);

                if (success) {
                  // Close the modal and refresh lessons
                  setShowLessonForm(false);
                  setEditingLesson(null);
                  // Refresh lessons to show the new/updated lesson
                  await lessonViewModel.loadLessonsByCourse(selectedCourse._id);
                }
                return success;
              }
              return false;
            }}
            onCancel={() => {
              setShowLessonForm(false);
              setEditingLesson(null);
            }}
            isLoading={lessonViewModel.isLoading}
          />
        )}

        <Footer />
      </div>
    );
  }

  return (
    <div
      key={`${themeKey}-${updateTrigger}`}
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Instructor Dashboard
              </h1>
              <p
                className="mt-2"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                Manage your courses and lessons
              </p>
            </div>
            <button
              onClick={async () => {
                await courseViewModel.loadCourses();
                await courseViewModel.loadStats();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
              style={{
                backgroundColor: isDark ? "#374151" : "#6b7280",
                color: "#ffffff",
              }}
              disabled={courseViewModel.isLoading}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div
              className="rounded-lg shadow p-6"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
              }}
            >
              <div className="flex items-center">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: isDark ? "#1e40af" : "#dbeafe" }}
                >
                  <BookOpen
                    className="w-6 h-6"
                    style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                  />
                </div>
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Total Courses
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    {stats.totalCourses}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg shadow p-6"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
              }}
            >
              <div className="flex items-center">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: isDark ? "#166534" : "#dcfce7" }}
                >
                  <TrendingUp
                    className="w-6 h-6"
                    style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                  />
                </div>
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Published
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    {stats.publishedCourses}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg shadow p-6"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
              }}
            >
              <div className="flex items-center">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: isDark ? "#92400e" : "#fef3c7" }}
                >
                  <BookOpen
                    className="w-6 h-6"
                    style={{ color: isDark ? "#fbbf24" : "#d97706" }}
                  />
                </div>
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Drafts
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    {stats.draftCourses}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg shadow p-6"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
              }}
            >
              <div className="flex items-center">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: isDark ? "#7c3aed" : "#f3e8ff" }}
                >
                  <Users
                    className="w-6 h-6"
                    style={{ color: isDark ? "#a78bfa" : "#9333ea" }}
                  />
                </div>
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Total Lessons
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    {stats.totalLessons}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Section */}
        <div
          className="rounded-lg shadow"
          style={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
          }}
        >
          <div
            className="p-6 border-b"
            style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-semibold"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                My Courses ({courseViewModel.courses.length})
              </h2>
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setShowCourseForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                }}
              >
                <Plus className="w-4 h-4" />
                Create Course
              </button>
            </div>
          </div>

          <div className="p-6">
            {courseViewModel.isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p
                  className="mt-2"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  Loading courses...
                </p>
              </div>
            ) : courseViewModel.courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
                />
                <p style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                  No courses yet. Create your first course!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseViewModel.courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                    onTogglePublish={handleTogglePublish}
                    onManageLessons={handleManageLessons}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}

            {courseViewModel.error && (
              <div
                className="mt-4 p-4 rounded-md border"
                style={{
                  backgroundColor: isDark ? "#7f1d1d" : "#fef2f2",
                  borderColor: isDark ? "#991b1b" : "#fecaca",
                }}
              >
                <p style={{ color: isDark ? "#fca5a5" : "#dc2626" }}>
                  {courseViewModel.error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          onSubmit={async (data) => {
            if (
              "title" in data &&
              "description" in data &&
              "category" in data &&
              "coverImage" in data &&
              "price" in data &&
              "type" in data
            ) {
              const success = editingCourse
                ? await handleUpdateCourse(data as UpdateCourseData)
                : await handleCreateCourse(data as CreateCourseData);

              if (success) {
                setShowCourseForm(false);
                setEditingCourse(null);
                // Refresh courses and stats
                await courseViewModel.loadCourses();
                await courseViewModel.loadStats();
              }
              return success;
            }
            return false;
          }}
          onCancel={() => {
            setShowCourseForm(false);
            setEditingCourse(null);
          }}
          isLoading={courseViewModel.isLoading}
        />
      )}

      <Footer />
    </div>
  );
}
