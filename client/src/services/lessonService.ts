import { authService } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface Lesson {
  _id: string;
  title: string;
  contentType: "video" | "text";
  content: string;
  description: string;
  attachment?: string;
  courseId: string;
  order: number;
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonData {
  title: string;
  contentType: "video" | "text";
  content: string;
  description: string;
  attachment?: string;
  courseId: string;
  order: number;
}

export interface UpdateLessonData {
  title?: string;
  contentType?: "video" | "text";
  content?: string;
  description?: string;
  attachment?: string;
  order?: number;
}

export interface LessonOrder {
  lessonId: string;
  order: number;
}

export class LessonService {
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
    return data;
  }

  async createLesson(data: CreateLessonData): Promise<Lesson> {
    return this.request<Lesson>("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return this.request<Lesson[]>(`/lessons/course/${courseId}`);
  }

  async getLessonById(lessonId: string): Promise<Lesson> {
    return this.request<Lesson>(`/lessons/${lessonId}`);
  }

  async updateLesson(
    lessonId: string,
    data: UpdateLessonData
  ): Promise<Lesson> {
    return this.request<Lesson>(`/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteLesson(lessonId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/lessons/${lessonId}`, {
      method: "DELETE",
    });
  }

  async reorderLessons(
    courseId: string,
    lessonOrders: LessonOrder[]
  ): Promise<Lesson[]> {
    return this.request<Lesson[]>(`/lessons/course/${courseId}/reorder`, {
      method: "POST",
      body: JSON.stringify({ lessonOrders }),
    });
  }

  async getNextLessonOrder(courseId: string): Promise<{ nextOrder: number }> {
    return this.request<{ nextOrder: number }>(
      `/lessons/course/${courseId}/next-order`
    );
  }

  async getLessonsByEnrollment(enrollmentId: string): Promise<Lesson[]> {
    return this.request<Lesson[]>(`/lessons/enrollment/${enrollmentId}`);
  }
}

export const lessonService = new LessonService();
