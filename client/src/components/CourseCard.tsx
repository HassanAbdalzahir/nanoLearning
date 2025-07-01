"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Edit,
  Trash2,
  BookOpen,
  DollarSign,
  Eye,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import { Course } from "@/services/courseService";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(course._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleTogglePublish = async () => {
    try {
      setIsToggling(true);
      await onTogglePublish(course._id);
    } catch (error) {
      console.error("Error toggling publish status:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: {
        bg: isDark ? "#1e40af" : "#dbeafe",
        text: isDark ? "#60a5fa" : "#1e40af",
      },
      business: {
        bg: isDark ? "#166534" : "#dcfce7",
        text: isDark ? "#4ade80" : "#16a34a",
      },
      design: {
        bg: isDark ? "#92400e" : "#fef3c7",
        text: isDark ? "#fbbf24" : "#d97706",
      },
      marketing: {
        bg: isDark ? "#7c3aed" : "#f3e8ff",
        text: isDark ? "#a78bfa" : "#9333ea",
      },
      default: {
        bg: isDark ? "#374151" : "#f3f4f6",
        text: isDark ? "#9ca3af" : "#6b7280",
      },
    };

    return colors[category as keyof typeof colors] || colors.default;
  };

  const categoryColors = getCategoryColor(course.category);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700"
      style={{
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
      }}
    >
      {/* Course Image */}
      <div
        className="relative h-48 overflow-hidden"
        style={{
          backgroundColor: isDark ? "#374151" : "#f3f4f6",
        }}
      >
        {course.coverImage ? (
          <Image
            src={course.coverImage}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                title={
                  course.isPublished ? "Unpublish course" : "Publish course"
                }
              >
                {course.isPublished ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

              {/* Tooltip */}
              {showTooltip && (
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs rounded-lg shadow-lg z-10"
                  style={{
                    backgroundColor: isDark ? "#374151" : "#1f2937",
                    color: isDark ? "#d1d5db" : "#f9fafb",
                  }}
                >
                  {course.isPublished ? "Unpublish" : "Publish"}
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                    style={{
                      borderTopColor: isDark ? "#374151" : "#1f2937",
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isDark ? "#7f1d1d" : "#fef2f2",
                color: isDark ? "#fca5a5" : "#dc2626",
              }}
              title="Delete course"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* More Options */}
          <div className="relative">
            <button
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                color: isDark ? "#9ca3af" : "#6b7280",
              }}
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Delete Course
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              Are you sure you want to delete &quot;{course.title}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: isDark ? "#374151" : "#f3f4f6",
                  color: isDark ? "#d1d5db" : "#374151",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
