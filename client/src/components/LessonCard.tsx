"use client";

import { Lesson } from "@/services/lessonService";
import {
  Edit,
  Trash2,
  Play,
  FileText,
  Paperclip,
  GripVertical,
} from "lucide-react";

interface LessonCardProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
  isDragging?: boolean;
  isDark?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export default function LessonCard({
  lesson,
  onEdit,
  onDelete,
  isDragging = false,
  isDark = false,
  dragHandleProps,
}: LessonCardProps) {
  const getContentTypeIcon = () => {
    return lesson.contentType === "video" ? (
      <Play className="w-4 h-4" />
    ) : (
      <FileText className="w-4 h-4" />
    );
  };

  const getContentTypeColor = () => {
    return lesson.contentType === "video"
      ? "text-blue-600 dark:text-blue-400"
      : "text-green-600 dark:text-green-400";
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div
      className={`
      rounded-lg border p-4 mb-3
      hover:shadow-md transition-all duration-200
      ${isDragging ? "opacity-50 shadow-lg" : ""}
    `}
      style={{
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        borderColor: isDark ? "#334155" : "#e5e7eb",
      }}
    >
      <div className="flex items-start justify-between">
        {/* Drag Handle */}
        <div className="flex items-center gap-3 flex-1">
          <div
            className="cursor-grab active:cursor-grabbing"
            style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
            {...dragHandleProps}
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Order Badge */}
          <div className="flex-shrink-0">
            <span
              className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full"
              style={{
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                color: isDark ? "#9ca3af" : "#374151",
              }}
            >
              {lesson.order}
            </span>
          </div>

          {/* Content Type Icon */}
          <div className={`flex-shrink-0 ${getContentTypeColor()}`}>
            {getContentTypeIcon()}
          </div>

          {/* Lesson Info */}
          <div className="flex-1 min-w-0">
            <h4
              className="text-sm font-medium mb-1 line-clamp-1"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              {lesson.title}
            </h4>
            <p
              className="text-xs line-clamp-2"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              {lesson.description}
            </p>

            {/* Content Preview */}
            <div className="mt-2">
              <p
                className="text-xs line-clamp-1"
                style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
              >
                {lesson.contentType === "video" ? "Video URL: " : "Content: "}
                {truncateContent(lesson.content, 60)}
              </p>
            </div>

            {/* Attachment */}
            {lesson.attachment && (
              <div
                className="mt-2 flex items-center gap-1 text-xs"
                style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
              >
                <Paperclip className="w-3 h-3" />
                <span>Has attachment</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-3">
          <button
            onClick={() => onEdit(lesson)}
            className="p-1 transition-colors"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            title="Edit lesson"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(lesson._id)}
            className="p-1 transition-colors"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            title="Delete lesson"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
