import { authService } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
    coverImage: string;
    instructorId: {
      _id: string;
      firstName: string;
      lastName: string;
      specialization?: string;
    };
    category: string;
    price: number;
    type: "video" | "text";
    lessons: Array<{
      _id: string;
      title: string;
      description: string;
      contentType: "video" | "text";
      content: string;
      order: number;
    }>;
  };
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  completedLessons: string[];
  isActive: boolean;
  lastAccessedAt: string;
}

export interface CreateEnrollmentData {
  courseId: string;
}

export interface UpdateProgressData {
  lessonId: string;
  completed: boolean;
}

export interface AvailableCourse {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  instructorId: {
    _id: string;
    firstName: string;
    lastName: string;
    specialization?: string;
  };
  category: string;
  price: number;
  type: "video" | "text";
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export class EnrollmentService {
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

  async enrollInCourse(courseId: string): Promise<Enrollment> {
    return this.request<Enrollment>(`/enrollments/courses/${courseId}/enroll`, {
      method: "POST",
    });
  }

  async getStudentEnrollments(): Promise<Enrollment[]> {
    return this.request<Enrollment[]>("/enrollments");
  }

  async getEnrollmentDetails(enrollmentId: string): Promise<Enrollment> {
    return this.request<Enrollment>(`/enrollments/${enrollmentId}`);
  }

  async updateProgress(
    enrollmentId: string,
    data: UpdateProgressData
  ): Promise<Enrollment> {
    return this.request<Enrollment>(`/enrollments/${enrollmentId}/progress`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async unenrollFromCourse(enrollmentId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/enrollments/${enrollmentId}`, {
      method: "DELETE",
    });
  }

  async getAvailableCourses(): Promise<AvailableCourse[]> {
    return this.request<AvailableCourse[]>("/enrollments/courses/available");
  }
}

export const enrollmentService = new EnrollmentService();
