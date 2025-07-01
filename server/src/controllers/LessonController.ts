import { Request, Response, NextFunction } from 'express';
import { LessonViewModel } from '../viewmodels/LessonViewModel';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const lessonVM = new LessonViewModel();

export class LessonController {
  createLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lessonData = req.body;

      // Validate lesson data
      const validationError = await lessonVM.validateLessonData(lessonData);
      if (validationError) {
        throw new Error(validationError);
      }

      const lesson = await lessonVM.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Lesson creation failed';
      next(createError(errorMessage, 400));
    }
  };

  getLessonsByCourse = async (
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

      const lessons = await lessonVM.getLessonsByCourse(courseId, instructorId);
      res.status(200).json(lessons);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch lessons';
      next(createError(errorMessage, 400));
    }
  };

  getLessonById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { lessonId } = req.params;
      const instructorId = req.user?._id;

      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }

      const lesson = await lessonVM.getLessonById(lessonId, instructorId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      res.status(200).json(lesson);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Lesson not found';
      next(createError(errorMessage, 404));
    }
  };

  updateLesson = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { lessonId } = req.params;
      const instructorId = req.user?._id;

      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }

      const lesson = await lessonVM.updateLesson(
        lessonId,
        instructorId,
        req.body
      );
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      res.status(200).json(lesson);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Lesson update failed';
      next(createError(errorMessage, 400));
    }
  };

  deleteLesson = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { lessonId } = req.params;
      const instructorId = req.user?._id;

      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }

      const deleted = await lessonVM.deleteLesson(lessonId, instructorId);
      if (!deleted) {
        throw new Error('Lesson not found');
      }

      res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Lesson deletion failed';
      next(createError(errorMessage, 400));
    }
  };

  reorderLessons = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { courseId } = req.params;
      const { lessonOrders } = req.body;
      const instructorId = req.user?._id;

      if (!instructorId) {
        throw new Error('User not authenticated');
      }

      if (!courseId) {
        throw new Error('Course ID is required');
      }

      if (!Array.isArray(lessonOrders)) {
        throw new Error('lessonOrders must be an array');
      }

      const lessons = await lessonVM.reorderLessons(
        courseId,
        instructorId,
        lessonOrders
      );
      res.status(200).json(lessons);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to reorder lessons';
      next(createError(errorMessage, 400));
    }
  };

  getNextLessonOrder = async (
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

      const nextOrder = await lessonVM.getNextLessonOrder(courseId);
      res.status(200).json({ nextOrder });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get next lesson order';
      next(createError(errorMessage, 400));
    }
  };

  getLessonsByEnrollment = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { enrollmentId } = req.params;
      const studentId = req.user?._id;
      if (!studentId) {
        throw new Error('User not authenticated');
      }
      if (!enrollmentId) {
        throw new Error('Enrollment ID is required');
      }
      // Find the enrollment and verify it belongs to the student
      const { Enrollment } = await import('../models/Enrollment');
      const enrollment = await Enrollment.findOne({
        _id: enrollmentId,
        studentId,
      });
      if (!enrollment) {
        throw new Error('Enrollment not found or access denied');
      }
      // Get lessons for the course
      const lessons = await lessonVM.getLessonsByCourse(
        enrollment.courseId.toString(),
        undefined
      );
      res.status(200).json(lessons);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch lessons for enrollment';
      next(createError(errorMessage, 400));
    }
  };
}
