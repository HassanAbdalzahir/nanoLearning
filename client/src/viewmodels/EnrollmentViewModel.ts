import {
  enrollmentService,
  Enrollment,
  AvailableCourse,
  UpdateProgressData,
} from "@/services/enrollmentService";

export interface EnrollmentState {
  enrollments: Enrollment[];
  availableCourses: AvailableCourse[];
  currentEnrollment: Enrollment | null;
  isLoading: boolean;
  error: string | null;
}

export class EnrollmentViewModel {
  private state: EnrollmentState = {
    enrollments: [],
    availableCourses: [],
    currentEnrollment: null,
    isLoading: false,
    error: null,
  };

  private listeners: ((state: EnrollmentState) => void)[] = [];

  // State management
  getState(): EnrollmentState {
    return { ...this.state };
  }

  subscribe(listener: (state: EnrollmentState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(newState: Partial<EnrollmentState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Getters
  get enrollments(): Enrollment[] {
    return this.state.enrollments;
  }

  get availableCourses(): AvailableCourse[] {
    return this.state.availableCourses;
  }

  get currentEnrollment(): Enrollment | null {
    return this.state.currentEnrollment;
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get error(): string | null {
    return this.state.error;
  }

  // Enrollment operations
  async loadEnrollments(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const enrollments = await enrollmentService.getStudentEnrollments();
      this.setState({ enrollments, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load enrollments";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  async loadAvailableCourses(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const availableCourses = await enrollmentService.getAvailableCourses();
      this.setState({ availableCourses, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load available courses";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  async loadPublicCourses(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const { courseService } = await import("@/services/courseService");
      const courses = await courseService.getPublishedCourses();
      this.setState({ availableCourses: courses, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load courses";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  async enrollInCourse(courseId: string): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      const newEnrollment = await enrollmentService.enrollInCourse(courseId);
      this.setState({
        enrollments: [newEnrollment, ...this.state.enrollments],
        // Remove the course from available courses
        availableCourses: this.state.availableCourses.filter(
          (course) => course._id !== courseId
        ),
        isLoading: false,
      });
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to enroll in course";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async loadEnrollmentDetails(enrollmentId: string): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const enrollment = await enrollmentService.getEnrollmentDetails(
        enrollmentId
      );
      this.setState({ currentEnrollment: enrollment, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load enrollment details";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  async updateProgress(
    enrollmentId: string,
    data: UpdateProgressData
  ): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      const updatedEnrollment = await enrollmentService.updateProgress(
        enrollmentId,
        data
      );

      // Update enrollments list
      this.setState({
        enrollments: this.state.enrollments.map((enrollment) =>
          enrollment._id === enrollmentId ? updatedEnrollment : enrollment
        ),
        // Update current enrollment if it's the same one
        currentEnrollment:
          this.state.currentEnrollment?._id === enrollmentId
            ? updatedEnrollment
            : this.state.currentEnrollment,
        isLoading: false,
      });
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update progress";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async unenrollFromCourse(enrollmentId: string): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      await enrollmentService.unenrollFromCourse(enrollmentId);

      // Remove from enrollments
      this.setState({
        enrollments: this.state.enrollments.filter(
          (e) => e._id !== enrollmentId
        ),
        // Don't add back to available courses as the course might not be available anymore
        currentEnrollment:
          this.state.currentEnrollment?._id === enrollmentId
            ? null
            : this.state.currentEnrollment,
        isLoading: false,
      });
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to unenroll from course";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  clearError(): void {
    this.setState({ error: null });
  }

  setCurrentEnrollment(enrollment: Enrollment | null): void {
    this.setState({ currentEnrollment: enrollment });
  }

  clearEnrollments(): void {
    this.setState({ enrollments: [], currentEnrollment: null });
  }

  clearAvailableCourses(): void {
    this.setState({ availableCourses: [] });
  }
}

export const enrollmentViewModel = new EnrollmentViewModel();
