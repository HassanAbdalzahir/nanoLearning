import {
  Lesson,
  ILesson,
  CreateLessonData,
  UpdateLessonData,
} from '../models/Lesson';
import { Course } from '../models/Course';
import mongoose from 'mongoose';

export class LessonViewModel {
  async createLesson(data: CreateLessonData): Promise<ILesson> {
    // Verify the course exists and belongs to the instructor
    const course = await Course.findById(data.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if order is already taken
    const existingLesson = await Lesson.findOne({
      courseId: data.courseId,
      order: data.order,
    });

    if (existingLesson) {
      throw new Error('A lesson with this order already exists');
    }

    const lesson = new Lesson({
      ...data,
      courseId: new mongoose.Types.ObjectId(data.courseId),
    });

    const savedLesson = await lesson.save();
    // Add lesson to course's lessons array
    await Course.findByIdAndUpdate(data.courseId, {
      $push: { lessons: savedLesson._id },
    });
    return savedLesson;
  }

  async getLessonsByCourse(
    courseId: string,
    instructorId?: string
  ): Promise<ILesson[]> {
    let course;
    if (instructorId) {
      // Verify the course belongs to the instructor
      course = await Course.findOne({ _id: courseId, instructorId });
      if (!course) {
        throw new Error('Course not found or access denied');
      }
    } else {
      // For students, just check course existence
      course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
    }
    return await Lesson.find({ courseId }).sort({ order: 1 });
  }

  async getLessonById(
    lessonId: string,
    instructorId: string
  ): Promise<ILesson | null> {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return null;

    // Verify the course belongs to the instructor
    const course = await Course.findOne({ _id: lesson.courseId, instructorId });
    if (!course) return null;

    return lesson;
  }

  async updateLesson(
    lessonId: string,
    instructorId: string,
    data: UpdateLessonData
  ): Promise<ILesson | null> {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return null;

    // Verify the course belongs to the instructor
    const course = await Course.findOne({ _id: lesson.courseId, instructorId });
    if (!course) return null;

    // If order is being changed, check for conflicts
    if (data.order && data.order !== lesson.order) {
      const existingLesson = await Lesson.findOne({
        courseId: lesson.courseId,
        order: data.order,
        _id: { $ne: lessonId },
      });

      if (existingLesson) {
        throw new Error('A lesson with this order already exists');
      }
    }

    return await Lesson.findByIdAndUpdate(lessonId, data, { new: true });
  }

  async deleteLesson(lessonId: string, instructorId: string): Promise<boolean> {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return false;

    // Verify the course belongs to the instructor
    const course = await Course.findOne({ _id: lesson.courseId, instructorId });
    if (!course) return false;

    const result = await Lesson.deleteOne({ _id: lessonId });
    return result.deletedCount > 0;
  }

  async reorderLessons(
    courseId: string,
    instructorId: string,
    lessonOrders: { lessonId: string; order: number }[]
  ): Promise<ILesson[]> {
    // Verify the course belongs to the instructor
    const course = await Course.findOne({ _id: courseId, instructorId });
    if (!course) {
      throw new Error('Course not found or access denied');
    }

    // Update each lesson's order
    const updatePromises = lessonOrders.map(({ lessonId, order }) =>
      Lesson.findByIdAndUpdate(lessonId, { order }, { new: true })
    );

    const updatedLessons = await Promise.all(updatePromises);
    return updatedLessons.filter((lesson) => lesson !== null) as ILesson[];
  }

  async validateLessonData(data: CreateLessonData): Promise<string | null> {
    if (!data.title || data.title.trim().length < 3) {
      return 'Lesson title must be at least 3 characters long';
    }

    if (!data.description || data.description.trim().length < 10) {
      return 'Lesson description must be at least 10 characters long';
    }

    if (!data.content || data.content.trim().length === 0) {
      return 'Lesson content is required';
    }

    if (!data.contentType || !['video', 'text'].includes(data.contentType)) {
      return 'Lesson content type must be either "video" or "text"';
    }

    if (data.contentType === 'video' && !this.isValidVideoUrl(data.content)) {
      return 'Please provide a valid video URL (YouTube, Vimeo, or direct video link)';
    }

    if (data.order < 1) {
      return 'Lesson order must be at least 1';
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

  async getNextLessonOrder(courseId: string): Promise<number> {
    const lastLesson = await Lesson.findOne({ courseId }).sort({ order: -1 });
    return lastLesson ? lastLesson.order + 1 : 1;
  }
}
