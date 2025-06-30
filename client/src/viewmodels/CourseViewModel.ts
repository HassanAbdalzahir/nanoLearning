import {
  courseService,
  Course,
  CreateCourseData,
  UpdateCourseData,
  CourseStats,
} from "@/services/courseService";

export interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  stats: CourseStats | null;
  isLoading: boolean;
  error: string | null;
}

export class CourseViewModel {
  private state: CourseState = {
    courses: [],
    currentCourse: null,
    stats: null,
    isLoading: false,
    error: null,
  };

  private listeners: ((state: CourseState) => void)[] = [];

  // State management
  getState(): CourseState {
    return { ...this.state };
  }

  subscribe(listener: (state: CourseState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(newState: Partial<CourseState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Getters
  get courses(): Course[] {
    return this.state.courses;
  }

  get currentCourse(): Course | null {
    return this.state.currentCourse;
  }

  get stats(): CourseStats | null {
    return this.state.stats;
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get error(): string | null {
    return this.state.error;
  }

  // Validation methods
  validateCourseData(data: CreateCourseData): string | null {
    if (!data.title || data.title.trim().length < 3) {
      return "Course title must be at least 3 characters long";
    }

    if (!data.description || data.description.trim().length < 10) {
      return "Course description must be at least 10 characters long";
    }

    if (!data.category) {
      return "Course category is required";
    }

    if (!data.coverImage) {
      return "Course cover image is required";
    }

    if (data.price && data.price < 0) {
      return "Course price cannot be negative";
    }

    if (!data.type || !["video", "text"].includes(data.type)) {
      return 'Course type must be either "video" or "text"';
    }

    return null;
  }

  // Course operations
  async loadCourses(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const courses = await courseService.getCourses();
      this.setState({ courses, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load courses";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  async loadCourseById(courseId: string): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const course = await courseService.getCourseById(courseId);
      this.setState({ currentCourse: course, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load course";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  async createCourse(data: CreateCourseData): Promise<boolean> {
    const validationError = this.validateCourseData(data);
    if (validationError) {
      this.setState({ error: validationError });
      return false;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const newCourse = await courseService.createCourse(data);
      this.setState({
        courses: [newCourse, ...this.state.courses],
        isLoading: false,
      });
      await this.loadStats();
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create course";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async updateCourse(
    courseId: string,
    data: UpdateCourseData
  ): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      const updatedCourse = await courseService.updateCourse(courseId, data);
      this.setState({
        courses: this.state.courses.map((course) =>
          course._id === courseId ? updatedCourse : course
        ),
        currentCourse:
          this.state.currentCourse?._id === courseId
            ? updatedCourse
            : this.state.currentCourse,
        isLoading: false,
      });
      await this.loadStats();
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update course";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      await courseService.deleteCourse(courseId);
      this.setState({
        courses: this.state.courses.filter((course) => course._id !== courseId),
        currentCourse:
          this.state.currentCourse?._id === courseId
            ? null
            : this.state.currentCourse,
        isLoading: false,
      });
      await this.loadStats();
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete course";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async togglePublishStatus(courseId: string): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      const updatedCourse = await courseService.togglePublishStatus(courseId);
      this.setState({
        courses: this.state.courses.map((course) =>
          course._id === courseId ? updatedCourse : course
        ),
        currentCourse:
          this.state.currentCourse?._id === courseId
            ? updatedCourse
            : this.state.currentCourse,
        isLoading: false,
      });
      await this.loadStats();
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to toggle publish status";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async loadStats(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const stats = await courseService.getCourseStats();
      this.setState({ stats, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load stats";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  clearError(): void {
    this.setState({ error: null });
  }

  setCurrentCourse(course: Course | null): void {
    this.setState({ currentCourse: course });
  }
}

export const courseViewModel = new CourseViewModel();
