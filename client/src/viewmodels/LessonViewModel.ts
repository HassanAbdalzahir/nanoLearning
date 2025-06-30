import {
  lessonService,
  Lesson,
  CreateLessonData,
  UpdateLessonData,
  LessonOrder,
} from "@/services/lessonService";

export interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;
}

export class LessonViewModel {
  private state: LessonState = {
    lessons: [],
    currentLesson: null,
    isLoading: false,
    error: null,
  };

  private listeners: ((state: LessonState) => void)[] = [];

  // State management
  getState(): LessonState {
    return { ...this.state };
  }

  subscribe(listener: (state: LessonState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(newState: Partial<LessonState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Getters
  get lessons(): Lesson[] {
    return this.state.lessons;
  }

  get currentLesson(): Lesson | null {
    return this.state.currentLesson;
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get error(): string | null {
    return this.state.error;
  }

  // Validation methods
  validateLessonData(data: CreateLessonData): string | null {
    if (!data.title || data.title.trim().length < 3) {
      return "Lesson title must be at least 3 characters long";
    }

    if (!data.description || data.description.trim().length < 10) {
      return "Lesson description must be at least 10 characters long";
    }

    if (!data.content || data.content.trim().length === 0) {
      return "Lesson content is required";
    }

    if (!data.contentType || !["video", "text"].includes(data.contentType)) {
      return 'Lesson content type must be either "video" or "text"';
    }

    if (data.contentType === "video" && !this.isValidVideoUrl(data.content)) {
      return "Please provide a valid video URL (YouTube, Vimeo, or direct video link)";
    }

    if (data.order < 1) {
      return "Lesson order must be at least 1";
    }

    return null;
  }

  private isValidVideoUrl(url: string): boolean {
    const videoUrlPatterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/,
      /^https?:\/\/(www\.)?youtu\.be\//,
      /^https?:\/\/(www\.)?vimeo\.com\//,
      /^https?:\/\/.*\.(mp4|webm|ogg)$/i,
    ];

    return videoUrlPatterns.some((pattern) => pattern.test(url));
  }

  // Lesson operations
  async loadLessonsByCourse(courseId: string): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const lessons = await lessonService.getLessonsByCourse(courseId);
      this.setState({ lessons, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load lessons";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  async loadLessonById(lessonId: string): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const lesson = await lessonService.getLessonById(lessonId);
      this.setState({ currentLesson: lesson, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load lesson";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }

  async createLesson(data: CreateLessonData): Promise<boolean> {
    const validationError = this.validateLessonData(data);
    if (validationError) {
      this.setState({ error: validationError });
      return false;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const newLesson = await lessonService.createLesson(data);
      this.setState({
        lessons: [...this.state.lessons, newLesson].sort(
          (a, b) => a.order - b.order
        ),
        isLoading: false,
      });
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create lesson";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async updateLesson(
    lessonId: string,
    data: UpdateLessonData
  ): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      const updatedLesson = await lessonService.updateLesson(lessonId, data);
      this.setState({
        lessons: this.state.lessons
          .map((lesson) => (lesson._id === lessonId ? updatedLesson : lesson))
          .sort((a, b) => a.order - b.order),
        currentLesson:
          this.state.currentLesson?._id === lessonId
            ? updatedLesson
            : this.state.currentLesson,
        isLoading: false,
      });
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update lesson";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async deleteLesson(lessonId: string): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      await lessonService.deleteLesson(lessonId);
      this.setState({
        lessons: this.state.lessons.filter((lesson) => lesson._id !== lessonId),
        currentLesson:
          this.state.currentLesson?._id === lessonId
            ? null
            : this.state.currentLesson,
        isLoading: false,
      });
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete lesson";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async reorderLessons(
    courseId: string,
    lessonOrders: LessonOrder[]
  ): Promise<boolean> {
    this.setState({ isLoading: true, error: null });

    try {
      const reorderedLessons = await lessonService.reorderLessons(
        courseId,
        lessonOrders
      );
      this.setState({
        lessons: reorderedLessons,
        isLoading: false,
      });
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reorder lessons";
      this.setState({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  }

  async getNextLessonOrder(courseId: string): Promise<number> {
    try {
      const { nextOrder } = await lessonService.getNextLessonOrder(courseId);
      return nextOrder;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to get next lesson order";
      this.setState({ error: errorMessage });
      return this.state.lessons.length + 1;
    }
  }

  async loadLessonsByEnrollment(enrollmentId: string): Promise<void> {
    this.setState({ isLoading: true, error: null });
    try {
      const lessons = await lessonService.getLessonsByEnrollment(enrollmentId);
      this.setState({ lessons, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load lessons";
      this.setState({ error: errorMessage, isLoading: false });
    }
  }

  clearError(): void {
    this.setState({ error: null });
  }

  setCurrentLesson(lesson: Lesson | null): void {
    this.setState({ currentLesson: lesson });
  }

  clearLessons(): void {
    this.setState({ lessons: [], currentLesson: null });
  }
}

export const lessonViewModel = new LessonViewModel();
