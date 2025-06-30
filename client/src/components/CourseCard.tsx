"use client";

import { Course } from "@/services/courseService";
import { useState } from "react";
import { Edit, Trash2, Eye, EyeOff, BookOpen, DollarSign } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onTogglePublish: (courseId: string) => void;
  onManageLessons: (courseId: string) => void;
  isDark?: boolean;
}

export default function CourseCard({
  course,
  onEdit,
  onDelete,
  onTogglePublish,
  onManageLessons,
  isDark = false,
}: CourseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      await onDelete(course._id);
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async () => {
    setIsToggling(true);
    await onTogglePublish(course._id);
    setIsToggling(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Programming: {
        bg: isDark ? "#1e40af" : "#dbeafe",
        text: isDark ? "#60a5fa" : "#1e40af",
      },
      Design: {
        bg: isDark ? "#7c3aed" : "#f3e8ff",
        text: isDark ? "#a78bfa" : "#9333ea",
      },
      Business: {
        bg: isDark ? "#166534" : "#dcfce7",
        text: isDark ? "#4ade80" : "#16a34a",
      },
      Marketing: {
        bg: isDark ? "#ea580c" : "#fed7aa",
        text: isDark ? "#fb923c" : "#ea580c",
      },
      Finance: {
        bg: isDark ? "#059669" : "#d1fae5",
        text: isDark ? "#34d399" : "#059669",
      },
      "Health & Fitness": {
        bg: isDark ? "#dc2626" : "#fee2e2",
        text: isDark ? "#f87171" : "#dc2626",
      },
      Music: {
        bg: isDark ? "#be185d" : "#fce7f3",
        text: isDark ? "#f472b6" : "#be185d",
      },
      Photography: {
        bg: isDark ? "#4338ca" : "#e0e7ff",
        text: isDark ? "#818cf8" : "#4338ca",
      },
      Language: {
        bg: isDark ? "#a16207" : "#fef3c7",
        text: isDark ? "#fbbf24" : "#a16207",
      },
      Technology: {
        bg: isDark ? "#374151" : "#f3f4f6",
        text: isDark ? "#9ca3af" : "#374151",
      },
      Other: {
        bg: isDark ? "#374151" : "#f3f4f6",
        text: isDark ? "#9ca3af" : "#374151",
      },
    };
    return colors[category] || colors.Other;
  };

  const categoryColors = getCategoryColor(course.category);

  return (
    <div
      className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border"
      style={{
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        borderColor: isDark ? "#334155" : "#e5e7eb",
      }}
    >
      {/* Course Image */}
      <div
        className="relative h-48 overflow-hidden"
        style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
      >
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen
              className="w-16 h-16"
              style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
          style={{ opacity: isDark ? 0.3 : 0.1 }}
        />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
            style={{
              backgroundColor: course.isPublished
                ? isDark
                  ? "#166534"
                  : "#dcfce7"
                : isDark
                ? "#92400e"
                : "#fef3c7",
              color: course.isPublished
                ? isDark
                  ? "#4ade80"
                  : "#16a34a"
                : isDark
                ? "#fbbf24"
                : "#d97706",
            }}
          >
            {course.isPublished ? "Published" : "Draft"}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
            style={{
              backgroundColor: isDark ? "#1e40af" : "#dbeafe",
              color: isDark ? "#60a5fa" : "#1e40af",
            }}
          >
            {course.type === "video" ? "Video" : "Text"}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Category */}
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 shadow-sm"
          style={{
            backgroundColor: categoryColors.bg,
            color: categoryColors.text,
          }}
        >
          {course.category}
        </span>

        {/* Title */}
        <h3
          className="text-xl font-bold mb-3 line-clamp-2 leading-tight"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        >
          {course.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm mb-6 line-clamp-3 leading-relaxed"
          style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
        >
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
            >
              <BookOpen
                className="w-4 h-4"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              />
            </div>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                Lessons
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                {course.lessons.length}
              </p>
            </div>
          </div>

          {course.price > 0 && (
            <div className="flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: isDark ? "#166534" : "#dcfce7" }}
              >
                <DollarSign
                  className="w-4 h-4"
                  style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                />
              </div>
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  Price
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                >
                  ${course.price}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}
        >
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(course)}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                color: isDark ? "#9ca3af" : "#6b7280",
              }}
              title="Edit course"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onManageLessons(course._id)}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                color: isDark ? "#9ca3af" : "#6b7280",
              }}
              title="Manage lessons"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Publish/Unpublish Button with Tooltip */}
            <div className="relative">
              <button
                onClick={handleTogglePublish}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                disabled={isToggling}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: course.isPublished
                    ? isDark
                      ? "#166534"
                      : "#dcfce7"
                    : isDark
                    ? "#374151"
                    : "#f3f4f6",
                  color: course.isPublished
                    ? isDark
                      ? "#4ade80"
                      : "#16a34a"
                    : isDark
                    ? "#9ca3af"
                    : "#6b7280",
                }}
                title={course.isPublished ? "Hide course" : "Publish course"}
              >
                {isToggling ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : course.isPublished ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>

              {/* Floating Tooltip */}
              {showTooltip && (
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 rounded-lg text-xs font-medium shadow-lg z-50 whitespace-nowrap"
                  style={{
                    backgroundColor: isDark ? "#1f2937" : "#374151",
                    color: isDark ? "#f9fafb" : "#ffffff",
                  }}
                >
                  {course.isPublished ? "Published" : "Hidden"}
                  {/* Tooltip Arrow */}
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                    style={{
                      borderTopColor: isDark ? "#1f2937" : "#374151",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isDark ? "#7f1d1d" : "#fef2f2",
              color: isDark ? "#fca5a5" : "#dc2626",
            }}
            title="Delete course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
