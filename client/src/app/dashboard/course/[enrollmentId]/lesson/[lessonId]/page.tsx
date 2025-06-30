"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { lessonViewModel } from "@/viewmodels/LessonViewModel";
import { enrollmentViewModel } from "@/viewmodels/EnrollmentViewModel";
import type { Lesson } from "@/services/lessonService";
import type { Enrollment } from "@/services/enrollmentService";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Download,
  File,
} from "lucide-react";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params.enrollmentId as string;
  const lessonId = params.lessonId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    // Load lessons and enrollment
    async function loadData() {
      setIsLoading(true);
      await enrollmentViewModel.loadEnrollmentDetails(enrollmentId);
      await lessonViewModel.loadLessonsByEnrollment(enrollmentId);
      const allLessons = lessonViewModel.lessons;
      setLessons(allLessons);
      const idx = allLessons.findIndex((l) => l._id === lessonId);
      setCurrentIndex(idx);
      setCurrentLesson(idx >= 0 ? allLessons[idx] : null);
      setEnrollment(
        enrollmentViewModel.enrollments.find((e) => e._id === enrollmentId) ||
          null
      );
      setIsLoading(false);
    }
    loadData();
    // Subscribe to updates
    const unsubEnroll = enrollmentViewModel.subscribe(() => {
      setEnrollment(
        enrollmentViewModel.enrollments.find((e) => e._id === enrollmentId) ||
          null
      );
    });
    const unsubLessons = lessonViewModel.subscribe(() => {
      const allLessons = lessonViewModel.lessons;
      setLessons(allLessons);
      const idx = allLessons.findIndex((l) => l._id === lessonId);
      setCurrentIndex(idx);
      setCurrentLesson(idx >= 0 ? allLessons[idx] : null);
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
      unsubEnroll();
      unsubLessons();
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [enrollmentId, lessonId]);

  if (isLoading || !currentLesson || !enrollment) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === lessons.length - 1;

  const handlePrev = () => {
    if (!isFirst) {
      router.push(
        `/dashboard/course/${enrollmentId}/lesson/${
          lessons[currentIndex - 1]._id
        }`
      );
    }
  };
  const handleNext = () => {
    if (!isLast) {
      router.push(
        `/dashboard/course/${enrollmentId}/lesson/${
          lessons[currentIndex + 1]._id
        }`
      );
    }
  };
  const handleBackToCourse = () => {
    router.push(`/dashboard/course/${enrollmentId}`);
  };
  const handleGoToDashboard = () => {
    router.push(`/dashboard`);
  };
  const handleMarkComplete = async () => {
    await enrollmentViewModel.updateProgress(enrollmentId, {
      lessonId: currentLesson._id,
      completed: true,
    });
  };

  const isCompleted = enrollment.completedLessons.includes(currentLesson._id);

  return (
    <div
      key={themeKey}
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={isFirst ? handleBackToCourse : handlePrev}
            className="flex items-center gap-2 font-medium transition-colors"
            style={{
              color: isDark ? "#9ca3af" : "#4b5563",
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            {isFirst ? "Back to Course" : "Previous Lesson"}
          </button>
          <button
            onClick={isLast ? handleGoToDashboard : handleNext}
            className="flex items-center gap-2 font-medium transition-colors"
            style={{
              color: isDark ? "#9ca3af" : "#4b5563",
            }}
          >
            {isLast ? "Go to Dashboard" : "Next Lesson"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {/* Lesson Card */}
        <div
          className="rounded-2xl shadow-lg p-8 mb-8"
          style={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: isDark ? "#1e40af" : "#dbeafe",
                color: isDark ? "#60a5fa" : "#2563eb",
              }}
            >
              Lesson {currentLesson.order} of {lessons.length}
            </span>
            {isCompleted && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ml-2"
                style={{
                  backgroundColor: isDark ? "#166534" : "#dcfce7",
                  color: isDark ? "#4ade80" : "#16a34a",
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Completed
              </span>
            )}
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: isDark ? "#ffffff" : "#111827" }}
          >
            {currentLesson.title}
          </h1>
          <p
            className="text-lg mb-6"
            style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
          >
            {currentLesson.description}
          </p>
          <div className="prose dark:prose-invert max-w-none mb-6">
            {currentLesson.contentType === "video" ? (
              <div
                className="aspect-video rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
              >
                <video
                  src={currentLesson.content}
                  controls
                  className="w-full h-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div
                style={{ color: isDark ? "#d1d5db" : "#374151" }}
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            )}
          </div>

          {/* Attachment Section */}
          {currentLesson.attachment && (
            <div
              className="mb-6 p-4 rounded-lg border"
              style={{
                backgroundColor: isDark ? "#374151" : "#f9fafb",
                borderColor: isDark ? "#4b5563" : "#e5e7eb",
              }}
            >
              <h3
                className="text-lg font-semibold mb-3 flex items-center gap-2"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                <File className="w-5 h-5" />
                Lesson Attachment
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: isDark ? "#1e40af" : "#dbeafe" }}
                  >
                    <File
                      className="w-6 h-6"
                      style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
                    >
                      {currentLesson.attachment.split("/").pop() ||
                        "Attachment"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                    >
                      Click to download
                    </p>
                  </div>
                </div>
                <a
                  href={currentLesson.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          )}

          {!isCompleted && (
            <button
              className="inline-flex items-center px-6 py-2 rounded-lg font-semibold text-base transition-colors shadow"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
              }}
              onClick={handleMarkComplete}
            >
              Mark as Complete
            </button>
          )}
        </div>
        {/* Progress Indicator */}
        <div
          className="flex justify-center gap-2 text-sm"
          style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
        >
          <span>
            Lesson {currentIndex + 1} of {lessons.length}
          </span>
          <span>•</span>
          <span>{enrollment.completedLessons.length} completed</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
