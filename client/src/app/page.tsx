"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  Play,
  ArrowRight,
  Globe,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);

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

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 lg:py-32"
        style={{
          backgroundColor: isDark ? "#1e293b" : "#f8fafc",
        }}
      >
        {/* Background Pattern - moved behind content */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>

        {/* Content Container - properly positioned */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 relative z-20"
              style={{
                color: isDark ? "#ffffff" : "#111827",
              }}
            >
              Learn, Grow,{" "}
              <span
                className="relative z-20"
                style={{
                  color: "#3b82f6",
                }}
              >
                Succeed
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto relative z-20"
              style={{
                color: isDark ? "#d1d5db" : "#4b5563",
              }}
            >
              Join thousands of learners worldwide and unlock your potential
              with our cutting-edge courses and interactive learning
              experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2 hover:bg-blue-700"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                }}
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/courses"
                className="border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2 hover:border-blue-600"
                style={{
                  borderColor: isDark ? "#4b5563" : "#d1d5db",
                  color: isDark ? "#d1d5db" : "#374151",
                }}
              >
                <Play className="w-5 h-5" />
                <span>Explore Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Why Choose nanoLearning?
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Experience the future of learning with our innovative platform
              designed for modern learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="p-8 rounded-xl hover:shadow-lg transition-shadow"
              style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#1e40af" : "#dbeafe" }}
              >
                <BookOpen
                  className="w-6 h-6"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Expert-Led Courses
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Learn from industry experts and professionals who share
                real-world insights and practical knowledge.
              </p>
            </div>

            <div
              className="p-8 rounded-xl hover:shadow-lg transition-shadow"
              style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#166534" : "#dcfce7" }}
              >
                <Clock
                  className="w-6 h-6"
                  style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Learn at Your Pace
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Access courses anytime, anywhere. Learn at your own speed with
                lifetime access to all content.
              </p>
            </div>

            <div
              className="p-8 rounded-xl hover:shadow-lg transition-shadow"
              style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#7c3aed" : "#f3e8ff" }}
              >
                <Award
                  className="w-6 h-6"
                  style={{ color: isDark ? "#a78bfa" : "#9333ea" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Earn Certificates
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Get recognized for your achievements with professional
                certificates upon course completion.
              </p>
            </div>

            <div
              className="p-8 rounded-xl hover:shadow-lg transition-shadow"
              style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#ea580c" : "#fed7aa" }}
              >
                <Users
                  className="w-6 h-6"
                  style={{ color: isDark ? "#fb923c" : "#ea580c" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Community Support
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Connect with fellow learners, share experiences, and get support
                from our vibrant community.
              </p>
            </div>

            <div
              className="p-8 rounded-xl hover:shadow-lg transition-shadow"
              style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#dc2626" : "#fee2e2" }}
              >
                <Zap
                  className="w-6 h-6"
                  style={{ color: isDark ? "#f87171" : "#dc2626" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Interactive Learning
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Engage with hands-on projects, quizzes, and real-world
                applications to reinforce your learning.
              </p>
            </div>

            <div
              className="p-8 rounded-xl hover:shadow-lg transition-shadow"
              style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#4338ca" : "#e0e7ff" }}
              >
                <Globe
                  className="w-6 h-6"
                  style={{ color: isDark ? "#818cf8" : "#4338ca" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Global Access
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Access our platform from anywhere in the world with our
                mobile-responsive design.
              </p>
            </div>
          </div>
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
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Sign in to access our comprehensive course library and start
              learning today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Sign In to See Courses</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/signup"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-20"
        style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
              >
                10K+
              </div>
              <div style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Active Learners
              </div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: isDark ? "#4ade80" : "#16a34a" }}
              >
                500+
              </div>
              <div style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Courses Available
              </div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: isDark ? "#a78bfa" : "#9333ea" }}
              >
                50+
              </div>
              <div style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Expert Instructors
              </div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: isDark ? "#fb923c" : "#ea580c" }}
              >
                95%
              </div>
              <div style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center mt-16 mb-8">
        <a
          href="/signup/teacher"
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
          style={{ fontSize: "1.15rem" }}
        >
          <span className="mr-2">Are you a teacher?</span> Sign up to teach{" "}
          <span className="ml-2">📚</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}
