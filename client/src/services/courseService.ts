import { authService } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  price: number;
  type: "video" | "text";
  isPublished: boolean;
  instructorId: {
    _id: string;
    firstName: string;
    lastName: string;
    specialization?: string;
  };
  lessons: Array<{
    _id: string;
    title: string;
    order: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  coverImage: string;
  price?: number;
  type: "video" | "text";
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  price?: number;
  type?: "video" | "text";
  isPublished?: boolean;
}

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalLessons: number;
}

export class CourseService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authService.getToken();

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    // Handle server response format: { success: true, data: [...] }
    return data.data || data;
  }

  private async publicRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("Making public request to:", url);

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API error:", errorData);
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Raw API response:", data);
    // Handle server response format: { success: true, data: [...] }
    const result = data.data || data;
    console.log("Processed API response:", result);
    return result;
  }

  async createCourse(data: CreateCourseData): Promise<Course> {
    return this.request<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCourses(): Promise<Course[]> {
    return this.request<Course[]>("/courses");
  }

  async getPublishedCourses(): Promise<Course[]> {
    console.log("Calling getPublishedCourses API...");
    try {
      const result = await this.publicRequest<Course[]>("/courses/public");
      console.log("getPublishedCourses API response:", result);
      return result;
    } catch (error) {
      console.error("Error in getPublishedCourses:", error);
      throw error;
    }
  }

  async getCourseById(courseId: string): Promise<Course> {
    return this.request<Course>(`/courses/${courseId}`);
  }

  async updateCourse(
    courseId: string,
    data: UpdateCourseData
  ): Promise<Course> {
    return this.request<Course>(`/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(courseId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/courses/${courseId}`, {
      method: "DELETE",
    });
  }

  async togglePublishStatus(courseId: string): Promise<Course> {
    return this.request<Course>(`/courses/${courseId}/toggle-publish`, {
      method: "PATCH",
    });
  }

  async getCourseStats(): Promise<CourseStats> {
    return this.request<CourseStats>("/courses/stats");
  }
}

export const courseService = new CourseService();
