import { Response, NextFunction } from 'express';
import { CourseViewModel } from '@/viewmodels/CourseViewModel';
import { createError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

const courseVM = new CourseViewModel();

export class CourseController {
  createCourse = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const instructorId = req.user?._id;
      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      const courseData = {
        ...req.body,
        instructorId,
      };

      // Validate course data
      const validationError = await courseVM.validateCourseData(courseData);
      if (validationError) {
        throw new Error(validationError);
      }

      const course = await courseVM.createCourse(courseData);
      res.status(201).json(course);
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  getCoursesByInstructor = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const instructorId = req.user?._id;
      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      const courses = await courseVM.getCoursesByInstructor(instructorId);
      res.status(200).json(courses);
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  getCourseById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { courseId } = req.params;
      const instructorId = req.user?._id;

      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      if (!courseId) {
        throw new Error('Course ID is required');
      }

      const course = await courseVM.getCourseById(courseId, instructorId);
      if (!course) {
        throw new Error('Course not found');
      }

      res.status(200).json(course);
    } catch (err: any) {
      next(createError(err.message, 404));
    }
  };

  updateCourse = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { courseId } = req.params;
      const instructorId = req.user?._id;

      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      if (!courseId) {
        throw new Error('Course ID is required');
      }

      const course = await courseVM.updateCourse(
        courseId,
        instructorId,
        req.body
      );
      if (!course) {
        throw new Error('Course not found');
      }

      res.status(200).json(course);
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  deleteCourse = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { courseId } = req.params;
      const instructorId = req.user?._id;

      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      if (!courseId) {
        throw new Error('Course ID is required');
      }

      const deleted = await courseVM.deleteCourse(courseId, instructorId);
      if (!deleted) {
        throw new Error('Course not found');
      }

      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  togglePublishStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { courseId } = req.params;
      const instructorId = req.user?._id;

      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      if (!courseId) {
        throw new Error('Course ID is required');
      }

      const course = await courseVM.togglePublishStatus(courseId, instructorId);
      if (!course) {
        throw new Error('Course not found');
      }

      res.status(200).json(course);
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  getCourseStats = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const instructorId = req.user?._id;
      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      const stats = await courseVM.getCourseStats(instructorId);
      res.status(200).json(stats);
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  // Get all published courses (public endpoint)
  getPublishedCourses = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('Getting published courses...');
      const courses = await courseVM.getPublishedCourses();
      console.log('Found courses:', courses.length, courses);

      // Transform the data to match client expectations
      const transformedCourses = courses.map((course) => ({
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        coverImage: course.coverImage,
        price: course.price,
        type: course.type,
        isPublished: course.isPublished,
        instructorId: course.instructorId,
        lessons: course.lessons,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      }));

      console.log('Transformed courses:', transformedCourses);
      res.status(200).json(transformedCourses);
    } catch (err: any) {
      console.error('Error getting published courses:', err);
      next(createError(err.message, 400));
    }
  };
}
