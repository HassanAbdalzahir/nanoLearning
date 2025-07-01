"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Play,
  Clock,
  ArrowRight,
  Lock,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { authViewModel } from "@/viewmodels/AuthViewModel";

export default function CoursesPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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

    // Set loading to false after initialization
    setLoading(false);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    try {
      // This would be implemented with enrollment service
      console.log("Enrolling in course:", courseId);
      router.push("/dashboard");
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Failed to enroll in course. Please try again.");
    }
  };

  // Mock data for demonstration
  const sortedCourses = [
    {
      _id: "1",
      title: "Introduction to React",
      description: "Learn the basics of React development",
      category: "technology",
      coverImage: "",
      price: 49.99,
      type: "video",
      isPublished: true,
      instructorId: { firstName: "John", lastName: "Doe" },
      lessons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "2",
      title: "Advanced JavaScript",
      description: "Master JavaScript concepts and patterns",
      category: "technology",
      coverImage: "",
      price: 79.99,
      type: "text",
      isPublished: true,
      instructorId: { firstName: "Jane", lastName: "Smith" },
      lessons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: "#ffffff" }}
            >
              Discover Amazing Courses
            </h1>
            <p
              className="text-xl md:text-2xl mb-8"
              style={{ color: "#e2e8f0" }}
            >
              Learn from expert instructors and advance your skills
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 text-white">
                <BookOpen className="w-5 h-5" />
                <span>500+ Courses</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white">
                <Clock className="w-5 h-5" />
                <span>4.8/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              {isAuthenticated ? "Available Courses" : "Featured Courses"}
            </h2>
            <p
              className="text-lg"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              {isAuthenticated
                ? "Courses you can enroll in"
                : "Start your learning journey with these courses"}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
                  style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}
                >
                  {/* Course Image */}
                  <div className="relative h-48">
                    {course.coverImage ? (
                      <Image
                        src={course.coverImage}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-80" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: isDark ? "#374151" : "#f3f4f6",
                          color: isDark ? "#d1d5db" : "#374151",
                        }}
                      >
                        {course.category}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: isDark ? "#1e40af" : "#dbeafe",
                          color: isDark ? "#60a5fa" : "#2563eb",
                        }}
                      >
                        {course.type}
                      </span>
                    </div>

                    <h3
                      className="text-xl font-semibold mb-2 line-clamp-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      {course.title}
                    </h3>

                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
                    >
                      {course.description}
                    </p>

                    <p
                      className="text-sm mb-4"
                      style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                    >
                      by {course.instructorId.firstName}{" "}
                      {course.instructorId.lastName}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock
                            className="w-4 h-4 mr-1"
                            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                          />
                          <span
                            style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
                          >
                            {course.type === "video"
                              ? "Video Course"
                              : "Text Course"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: isDark ? "#ffffff" : "#111827" }}
                        >
                          ${course.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                      >
                        <span>Enroll</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show sign-in prompt for unauthenticated users after courses */}
          {!isAuthenticated && sortedCourses.length > 0 && (
            <div className="mt-16 max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)",
                    }}
                  >
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  Sign in to Enroll
                </h2>
                <p
                  className="text-lg mb-8"
                  style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
                >
                  Create an account to enroll in courses and track your progress
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6"
                  style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}
                >
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    Already have an account?
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Sign in to continue your learning journey
                  </p>
                  <button
                    onClick={handleSignIn}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </div>

                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6"
                  style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}
                >
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    New to nanoLearning?
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                  >
                    Create an account and start learning today
                  </p>
                  <button
                    onClick={handleSignUp}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(to right, #2563eb, #8b5cf6)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who are already learning and growing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSignUp}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Get Started</span>
              </button>
              <button
                onClick={handleSignIn}
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
