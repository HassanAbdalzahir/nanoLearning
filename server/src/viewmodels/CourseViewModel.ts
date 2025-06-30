import {
  Course,
  ICourse,
  CreateCourseData,
  UpdateCourseData,
} from '@/models/Course';
import { Lesson } from '@/models/Lesson';
import mongoose from 'mongoose';

export class CourseViewModel {
  async createCourse(data: CreateCourseData): Promise<ICourse> {
    const course = new Course({
      ...data,
      instructorId: new mongoose.Types.ObjectId(data.instructorId),
    });
    return await course.save();
  }

  async getCoursesByInstructor(instructorId: string): Promise<ICourse[]> {
    return await Course.find({ instructorId })
      .populate('lessons', 'title order')
      .sort({ createdAt: -1 });
  }

  async getCourseById(
    courseId: string,
    instructorId: string
  ): Promise<ICourse | null> {
    return await Course.findOne({
      _id: courseId,
      instructorId,
    }).populate('lessons');
  }

  async updateCourse(
    courseId: string,
    instructorId: string,
    data: UpdateCourseData
  ): Promise<ICourse | null> {
    return await Course.findOneAndUpdate(
      { _id: courseId, instructorId },
      data,
      { new: true }
    );
  }

  async deleteCourse(courseId: string, instructorId: string): Promise<boolean> {
    // Delete all lessons associated with the course
    await Lesson.deleteMany({ courseId });

    // Delete the course
    const result = await Course.deleteOne({ _id: courseId, instructorId });
    return result.deletedCount > 0;
  }

  async togglePublishStatus(
    courseId: string,
    instructorId: string
  ): Promise<ICourse | null> {
    const course = await Course.findOne({ _id: courseId, instructorId });
    if (!course) return null;

    course.isPublished = !course.isPublished;
    return await course.save();
  }

  async getCourseStats(instructorId: string): Promise<{
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    totalLessons: number;
  }> {
    const [totalCourses, publishedCourses, draftCourses, totalLessons] =
      await Promise.all([
        Course.countDocuments({ instructorId }),
        Course.countDocuments({ instructorId, isPublished: true }),
        Course.countDocuments({ instructorId, isPublished: false }),
        Lesson.countDocuments({
          courseId: {
            $in: await Course.find({ instructorId }).distinct('_id'),
          },
        }),
      ]);

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalLessons,
    };
  }

  async getPublishedCourses(): Promise<ICourse[]> {
    return await Course.find({ isPublished: true })
      .populate('instructorId', 'firstName lastName specialization')
      .populate('lessons', 'title order')
      .sort({ createdAt: -1 });
  }

  async validateCourseData(data: CreateCourseData): Promise<string | null> {
    if (!data.title || data.title.trim().length < 3) {
      return 'Course title must be at least 3 characters long';
    }

    if (!data.description || data.description.trim().length < 10) {
      return 'Course description must be at least 10 characters long';
    }

    if (!data.category) {
      return 'Course category is required';
    }

    if (!data.coverImage) {
      return 'Course cover image is required';
    }

    if (data.price && data.price < 0) {
      return 'Course price cannot be negative';
    }

    if (!data.type || !['video', 'text'].includes(data.type)) {
      return 'Course type must be either "video" or "text"';
    }

    return null;
  }
}
