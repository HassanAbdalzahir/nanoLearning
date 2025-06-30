import { authService } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface UploadResponse {
  success: boolean;
  url: string;
  publicId: string;
  originalName: string;
  size: number;
}

export class UploadService {
  private async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authService.getToken();

    if (!token) {
      throw new Error("Authentication required");
    }

    const formData = new FormData();
    formData.append(
      endpoint.includes("video")
        ? "video"
        : endpoint.includes("cover-image")
        ? "coverImage"
        : "attachment",
      file
    );

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error("Invalid response format"));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errorResponse.error?.message || `Upload failed: ${xhr.status}`
              )
            );
          } catch {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload was cancelled"));
      });

      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  }

  async uploadVideo(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    // Validate file type
    if (!file.type.startsWith("video/")) {
      throw new Error("Please select a valid video file");
    }

    // Validate file size (500MB limit)
    if (file.size > 500 * 1024 * 1024) {
      throw new Error("Video file size must be less than 500MB");
    }

    return this.uploadFile("/upload/video", file, onProgress);
  }

  async uploadAttachment(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Please select a valid file type (PDF, Word, Excel, text, or image)"
      );
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File size must be less than 50MB");
    }

    return this.uploadFile("/upload/attachment", file, onProgress);
  }

  async uploadCoverImage(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file");
    }

    // Validate file size (10MB limit for images)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image file size must be less than 10MB");
    }

    return this.uploadFile("/upload/cover-image", file, onProgress);
  }

  // Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Helper method to get file extension
  getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "";
  }

  // Helper method to check if file is video
  isVideoFile(file: File): boolean {
    return file.type.startsWith("video/");
  }

  // Helper method to check if file is image
  isImageFile(file: File): boolean {
    return file.type.startsWith("image/");
  }
}

export const uploadService = new UploadService();
