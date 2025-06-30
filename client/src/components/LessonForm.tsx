"use client";

import { useState, useEffect } from "react";
import {
  Lesson,
  CreateLessonData,
  UpdateLessonData,
} from "@/services/lessonService";
import { uploadService } from "@/services/uploadService";
import { X } from "lucide-react";
import FileUpload from "./FileUpload";

interface LessonFormProps {
  lesson?: Lesson | null;
  courseId: string;
  nextOrder: number;
  onSubmit: (data: CreateLessonData | UpdateLessonData) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LessonForm({
  lesson,
  courseId,
  nextOrder,
  onSubmit,
  onCancel,
  isLoading = false,
}: LessonFormProps) {
  const [formData, setFormData] = useState<CreateLessonData>({
    title: "",
    contentType: "video",
    content: "",
    description: "",
    attachment: "",
    courseId,
    order: nextOrder,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedVideo, setUploadedVideo] = useState<{
    url: string;
    publicId: string;
  } | null>(null);
  const [uploadedAttachment, setUploadedAttachment] = useState<{
    url: string;
    publicId: string;
  } | null>(null);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        contentType: lesson.contentType,
        content: lesson.content,
        description: lesson.description,
        attachment: lesson.attachment || "",
        courseId: lesson.courseId,
        order: lesson.order,
      });
    } else {
      setFormData((prev) => ({ ...prev, order: nextOrder }));
    }
  }, [lesson, nextOrder, courseId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.contentType === "video") {
      if (!formData.content.trim() && !uploadedVideo) {
        newErrors.content = "Video content is required";
      }
    } else {
      if (!formData.content.trim()) {
        newErrors.content = "Content is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Use uploaded video URL if available
    const finalContent = uploadedVideo ? uploadedVideo.url : formData.content;
    const finalAttachment = uploadedAttachment
      ? uploadedAttachment.url
      : formData.attachment;

    const submitData = {
      ...formData,
      content: finalContent,
      attachment: finalAttachment,
    };

    const success = await onSubmit(submitData);
    if (success) {
      onCancel();
    }
  };

  const handleInputChange = (
    field: keyof CreateLessonData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleVideoUpload = async (file: File) => {
    const result = await uploadService.uploadVideo(file);
    setUploadedVideo(result);
    setFormData((prev) => ({ ...prev, content: result.url }));
    setErrors((prev) => ({ ...prev, content: "" }));
    return result;
  };

  const handleAttachmentUpload = async (file: File) => {
    const result = await uploadService.uploadAttachment(file);
    setUploadedAttachment(result);
    setFormData((prev) => ({ ...prev, attachment: result.url }));
    return result;
  };

  const clearVideoUpload = () => {
    setUploadedVideo(null);
    setFormData((prev) => ({ ...prev, content: "" }));
  };

  const clearAttachmentUpload = () => {
    setUploadedAttachment(null);
    setFormData((prev) => ({ ...prev, attachment: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {lesson ? "Edit Lesson" : "Add New Lesson"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Lesson Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.title
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter lesson title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter lesson description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Content Type */}
          <div>
            <label
              htmlFor="contentType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Content Type *
            </label>
            <select
              id="contentType"
              value={formData.contentType}
              onChange={(e) =>
                handleInputChange(
                  "contentType",
                  e.target.value as "video" | "text"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {formData.contentType === "video"
                ? "Video Content"
                : "Text Content"}{" "}
              *
            </label>

            {formData.contentType === "video" ? (
              <div className="space-y-4">
                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Video File
                  </label>
                  <FileUpload
                    onUpload={handleVideoUpload}
                    onCancel={clearVideoUpload}
                    accept="video/*"
                    maxSize={500 * 1024 * 1024} // 500MB
                    label="Upload Video"
                    placeholder="Click to upload video or drag and drop"
                    className="mb-3"
                  />
                </div>
              </div>
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.content
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter lesson content..."
              />
            )}

            {errors.content && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.content}
              </p>
            )}
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachment (Optional)
            </label>
            <FileUpload
              onUpload={handleAttachmentUpload}
              onCancel={clearAttachmentUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
              maxSize={50 * 1024 * 1024} // 50MB
              label="Upload Attachment"
              placeholder="Click to upload attachment or drag and drop"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PDF, Word, Excel, text, or image files (max 50MB)
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? "Saving..."
                : lesson
                ? "Update Lesson"
                : "Add Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
