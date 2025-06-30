"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { authViewModel } from "@/viewmodels/AuthViewModel";
import { enrollmentViewModel } from "@/viewmodels/EnrollmentViewModel";
import {
  BookOpen,
  Lock,
  ArrowRight,
  Search,
  Clock,
  ChevronDown,
  Play,
} from "lucide-react";

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth viewmodel
    authViewModel.initialize();

    // Debug API URL
    console.log(
      "API URL:",
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    );

    // Load courses based on authentication status
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const currentAuthStatus = authViewModel.isAuthenticated();
        const currentUser = authViewModel.user;

        console.log(
          "Loading courses - Auth status:",
          currentAuthStatus,
          "User:",
          currentUser
        );

        if (currentAuthStatus && currentUser?.role === "student") {
          // For authenticated students, load available courses (courses they can enroll in)
          console.log("Loading available courses for student");
          await enrollmentViewModel.loadAvailableCourses();
        } else {
          // For unauthenticated users or teachers, load public courses
          console.log("Loading public courses");
          await enrollmentViewModel.loadPublicCourses();
        }

        console.log("Courses loaded:", enrollmentViewModel.availableCourses);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadCourses();

    // Subscribe to auth changes
    const unsubscribeAuth = authViewModel.subscribe((authState) => {
      const newAuthStatus = authState.user !== null;
      setIsAuthenticated(newAuthStatus);

      // Reload courses when auth status changes
      loadCourses();
    });

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
      unsubscribeAuth();
    };
  }, []);

  // Subscribe to enrollment viewmodel for course data changes
  useEffect(() => {
    const unsubscribe = enrollmentViewModel.subscribe(() => {
      // Force re-render when enrollment data changes
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleSignUp = () => {
    router.push("/signup/student");
  };

  const handleEnroll = async (courseId: string) => {
    if (!authViewModel.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const success = await enrollmentViewModel.enrollInCourse(courseId);
    if (success) {
      // Show success message or redirect to dashboard
      router.push("/dashboard");
    }
  };

  const categories = [
    "All",
    "Programming",
    "Design",
    "Business",
    "Marketing",
    "Finance",
    "Health & Fitness",
    "Music",
    "Photography",
    "Language",
    "Technology",
    "Other",
  ];

  const availableCourses = enrollmentViewModel.availableCourses;
  const viewModelLoading = enrollmentViewModel.isLoading;

  const filteredCourses = availableCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${course.instructorId.firstName} ${course.instructorId.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />

      {/* Hero Section */}
      <section
        className="py-20"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Explore Our Courses
            </h1>
            <p
              className="text-xl mb-8 max-w-3xl mx-auto"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Discover high-quality courses taught by industry experts. Start
              your learning journey today and unlock your potential.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section
        className="py-8 border-b"
        style={{
          backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              />
              <input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors"
                style={{
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  borderColor: isDark ? "#374151" : "#d1d5db",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 rounded-lg border transition-colors cursor-pointer"
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    borderColor: isDark ? "#374151" : "#d1d5db",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 rounded-lg border transition-colors cursor-pointer"
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    borderColor: isDark ? "#374151" : "#d1d5db",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section
        className="py-16"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading || viewModelLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p
                className="mt-4"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                Loading courses...
              </p>
            </div>
          ) : sortedCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                No courses found
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedCourses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: isDark ? "#1e293b" : "#ffffff" }}
                >
                  {/* Course Image */}
                  <div className="relative h-48">
                    {course.coverImage ? (
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover"
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
              Join thousands of learners who are already transforming their
              lives with our courses.
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
              <span>Browse All Courses</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
