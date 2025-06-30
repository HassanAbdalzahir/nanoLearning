"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  BookOpen,
  Users,
  Target,
  Award,
  Globe,
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AboutPage() {
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
              About nanoLearning
            </h1>
            <p
              className="text-xl mb-8 max-w-3xl mx-auto"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              We&apos;re on a mission to democratize education and make quality
              learning accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        className="py-20"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Our Mission
              </h2>
              <p
                className="text-lg mb-6"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                At nanoLearning, we believe that education should be accessible,
                engaging, and transformative. Our platform connects learners
                with world-class instructors and cutting-edge content to help
                them achieve their goals and unlock their potential.
              </p>
              <p
                className="text-lg mb-8"
                style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
              >
                Whether you&apos;re looking to advance your career, learn a new
                skill, or explore your passions, we provide the tools,
                resources, and community support you need to succeed.
              </p>
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center"
                  style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">10K+ Learners</span>
                </div>
                <div
                  className="flex items-center"
                  style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">500+ Courses</span>
                </div>
              </div>
            </div>
            <div
              className="rounded-2xl p-8"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
              }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
              <p className="text-blue-100 mb-6">
                To become the world&apos;s leading platform for accessible,
                high-quality education that empowers individuals to create
                meaningful change in their lives and communities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-300 mr-3" />
                  <span className="text-white">Innovation in Learning</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-300 mr-3" />
                  <span className="text-white">Global Accessibility</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-300 mr-3" />
                  <span className="text-white">Community Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        className="py-20"
        style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Our Values
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              These core values guide everything we do and shape the learning
              experience we provide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="rounded-xl p-8 shadow-lg"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
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
                Quality Education
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                We partner with expert instructors and industry leaders to
                deliver high-quality, up-to-date content that meets the highest
                educational standards.
              </p>
            </div>

            <div
              className="rounded-xl p-8 shadow-lg"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#166534" : "#dcfce7" }}
              >
                <Globe
                  className="w-6 h-6"
                  style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Accessibility
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                We believe education should be available to everyone, regardless
                of location, background, or financial circumstances.
              </p>
            </div>

            <div
              className="rounded-xl p-8 shadow-lg"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#7c3aed" : "#f3e8ff" }}
              >
                <Users
                  className="w-6 h-6"
                  style={{ color: isDark ? "#a78bfa" : "#9333ea" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Community
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                We foster a supportive learning community where students can
                connect, collaborate, and grow together.
              </p>
            </div>

            <div
              className="rounded-xl p-8 shadow-lg"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#ea580c" : "#fed7aa" }}
              >
                <Award
                  className="w-6 h-6"
                  style={{ color: isDark ? "#fb923c" : "#ea580c" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Excellence
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                We strive for excellence in everything we do, from course
                content to user experience to customer support.
              </p>
            </div>

            <div
              className="rounded-xl p-8 shadow-lg"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#dc2626" : "#fee2e2" }}
              >
                <Heart
                  className="w-6 h-6"
                  style={{ color: isDark ? "#f87171" : "#dc2626" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Passion
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                We&apos;re passionate about learning and committed to helping
                others discover their potential and achieve their dreams.
              </p>
            </div>

            <div
              className="rounded-xl p-8 shadow-lg"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#4338ca" : "#e0e7ff" }}
              >
                <Target
                  className="w-6 h-6"
                  style={{ color: isDark ? "#818cf8" : "#4338ca" }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Innovation
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                We continuously innovate our platform and teaching methods to
                provide the best possible learning experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Team
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Our dedicated team of educators, technologists, and innovators
              work together to create an exceptional learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                }}
              >
                <span className="text-3xl font-bold text-white">JD</span>
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                John Doe
              </h3>
              <p
                className="font-medium mb-2"
                style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
              >
                CEO & Founder
              </p>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Former educator with 15+ years of experience in online learning
                platforms.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <span className="text-3xl font-bold text-white">JS</span>
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Jane Smith
              </h3>
              <p
                className="font-medium mb-2"
                style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
              >
                Chief Technology Officer
              </p>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Tech leader passionate about creating scalable, user-friendly
                learning solutions.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                }}
              >
                <span className="text-3xl font-bold text-white">MJ</span>
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Mike Johnson
              </h3>
              <p
                className="font-medium mb-2"
                style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
              >
                Head of Content
              </p>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Curriculum expert dedicated to creating engaging, effective
                learning experiences.
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
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of learners who are already transforming their
              lives with nanoLearning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/courses"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
