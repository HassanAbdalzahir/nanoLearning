"use client";

import { useState, useEffect } from "react";
import {
  Course,
  CreateCourseData,
  UpdateCourseData,
} from "@/services/courseService";
import { uploadService } from "@/services/uploadService";
import { X } from "lucide-react";
import FileUpload from "./FileUpload";

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (data: CreateCourseData | UpdateCourseData) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORIES = [
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

export default function CourseForm({
  course,
  onSubmit,
  onCancel,
  isLoading = false,
}: CourseFormProps) {
  const [formData, setFormData] = useState<CreateCourseData>({
    title: "",
    description: "",
    category: "",
    coverImage: "",
    price: 0,
    type: "video",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    publicId: string;
  } | null>(null);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        coverImage: course.coverImage,
        price: course.price,
        type: course.type,
      });
    }
  }, [course]);

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

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.coverImage && !uploadedImage) {
      newErrors.coverImage = "Cover image is required";
    }

    if (typeof formData.price === "number" && formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Use uploaded image URL if available
    const finalCoverImage = uploadedImage
      ? uploadedImage.url
      : formData.coverImage;

    const submitData = {
      ...formData,
      coverImage: finalCoverImage,
    };

    const success = await onSubmit(submitData);
    if (success) {
      onCancel();
    }
  };

  const handleInputChange = (
    field: keyof CreateCourseData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = async (
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    const result = await uploadService.uploadCoverImage(file, onProgress);
    setUploadedImage(result);
    setFormData((prev) => ({ ...prev, coverImage: result.url }));
    setErrors((prev) => ({ ...prev, coverImage: "" }));
    return result;
  };

  const clearImageUpload = () => {
    setUploadedImage(null);
    setFormData((prev) => ({ ...prev, coverImage: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {course ? "Edit Course" : "Create New Course"}
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
              Course Title *
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
              placeholder="Enter course title"
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
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter course description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.category
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Course Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  handleInputChange("type", e.target.value as "video" | "text")
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="video">Video Course</option>
                <option value="text">Text Course</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              value={formData.price ?? 0}
              onChange={(e) =>
                handleInputChange("price", parseFloat(e.target.value) || 0)
              }
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.price
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.price}
              </p>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image *
            </label>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Cover Image
              </label>
              <FileUpload
                onUpload={handleImageUpload}
                onCancel={clearImageUpload}
                accept="image/*"
                maxSize={10 * 1024 * 1024} // 10MB
                label="Upload Cover Image"
                placeholder="Click to upload image or drag and drop"
              />
            </div>

            {/* Image Preview */}
            {(formData.coverImage || uploadedImage) && (
              <div className="mt-3">
                <img
                  src={uploadedImage?.url || formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
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
                : course
                ? "Update Course"
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
