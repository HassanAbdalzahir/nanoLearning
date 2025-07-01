import { Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Enrollment } from '../models/Enrollment';
import { Course } from '../models/Course';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

interface CourseWithLessons {
  _id: string;
  lessons: Array<{
    _id: string;
    title: string;
    description: string;
    contentType: string;
    content: string;
    order: number;
  }>;
}

export class EnrollmentController {
  // Enroll in a course
  static enrollInCourse = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const { courseId } = req.params;
      const studentId = req.user?._id;

      if (!studentId) {
        res.status(401).json({
          error: { message: 'User not authenticated', statusCode: 401 },
        });
        return;
      }

      // Check if course exists and is published
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({
          error: { message: 'Course not found', statusCode: 404 },
        });
        return;
      }

      if (!course.isPublished) {
        res.status(400).json({
          error: {
            message: 'Course is not available for enrollment',
            statusCode: 400,
          },
        });
        return;
      }

      // Check if student is already enrolled
      const existingEnrollment = await Enrollment.findOne({
        studentId,
        courseId,
        isActive: true,
      });

      if (existingEnrollment) {
        res.status(400).json({
          error: {
            message: 'Already enrolled in this course',
            statusCode: 400,
          },
        });
        return;
      }

      // Create enrollment
      const enrollment = await Enrollment.create({
        studentId,
        courseId,
        enrolledAt: new Date(),
        progress: 0,
        completedLessons: [],
        isActive: true,
        lastAccessedAt: new Date(),
      });

      await enrollment.populate([
        {
          path: 'courseId',
          select: 'title description coverImage instructorId',
        },
        { path: 'studentId', select: 'firstName lastName email' },
      ]);

      logger.info(`Student ${studentId} enrolled in course ${courseId}`);

      res.status(201).json({
        success: true,
        data: enrollment,
      });
    }
  );

  // Get student's enrollments
  static getStudentEnrollments = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const studentId = req.user?._id;

      if (!studentId) {
        res.status(401).json({
          error: { message: 'User not authenticated', statusCode: 401 },
        });
        return;
      }

      const enrollments = await Enrollment.find({
        studentId,
        isActive: true,
      }).populate([
        {
          path: 'courseId',
          select:
            'title description coverImage instructorId category price type',
          populate: [
            {
              path: 'instructorId',
              select: 'firstName lastName',
            },
            {
              path: 'lessons',
              select: 'title description contentType content order',
            },
          ],
        },
      ]);

      // Add totalLessons and completedLessonsCount to each enrollment
      const enrollmentsWithCounts = await Promise.all(
        enrollments.map(async (enrollment) => {
          let lessons: Array<{
            _id: string;
            title: string;
            description: string;
            contentType: string;
            content: string;
            order: number;
          }> = [];
          if (
            enrollment.courseId &&
            typeof enrollment.courseId === 'object' &&
            'lessons' in enrollment.courseId &&
            Array.isArray(
              (enrollment.courseId as unknown as CourseWithLessons).lessons
            ) &&
            (enrollment.courseId as unknown as CourseWithLessons).lessons
              .length > 0
          ) {
            lessons = (enrollment.courseId as unknown as CourseWithLessons)
              .lessons;
          } else if (
            enrollment.courseId &&
            typeof enrollment.courseId === 'object' &&
            '_id' in enrollment.courseId
          ) {
            // Fallback: fetch lessons directly from Lesson model
            const { Lesson } = await import('../models/Lesson');
            lessons = await Lesson.find({
              courseId: (enrollment.courseId as unknown as { _id: string })._id,
            });
          }
          const totalLessons = lessons.length;
          const completedLessonsCount = lessons.filter((lesson) =>
            enrollment.completedLessons
              .map((id) => id.toString())
              .includes(lesson._id.toString())
          ).length;
          return {
            ...enrollment.toObject(),
            totalLessons,
            completedLessonsCount,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: enrollmentsWithCounts,
      });
    }
  );

  // Get enrollment details
  static getEnrollmentDetails = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const { enrollmentId } = req.params;
      const studentId = req.user?._id;

      if (!studentId) {
        res.status(401).json({
          error: { message: 'User not authenticated', statusCode: 401 },
        });
        return;
      }

      const enrollment = await Enrollment.findOne({
        _id: enrollmentId,
        studentId,
        isActive: true,
      }).populate([
        {
          path: 'courseId',
          populate: [
            {
              path: 'instructorId',
              select: 'firstName lastName email specialization',
            },
            {
              path: 'lessons',
              select: 'title description contentType content order',
            },
          ],
        },
      ]);

      if (!enrollment) {
        res.status(404).json({
          error: { message: 'Enrollment not found', statusCode: 404 },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: enrollment,
      });
    }
  );

  // Update enrollment progress
  static updateProgress = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const { enrollmentId } = req.params;
      const { lessonId, completed } = req.body;
      const studentId = req.user?._id;

      if (!studentId) {
        res.status(401).json({
          error: { message: 'User not authenticated', statusCode: 401 },
        });
        return;
      }

      const enrollment = await Enrollment.findOne({
        _id: enrollmentId,
        studentId,
        isActive: true,
      });

      if (!enrollment) {
        res.status(404).json({
          error: { message: 'Enrollment not found', statusCode: 404 },
        });
        return;
      }

      // Update completed lessons
      if (
        completed &&
        !enrollment.completedLessons.some((id) => id.toString() === lessonId)
      ) {
        enrollment.completedLessons.push(lessonId);
      } else if (
        !completed &&
        enrollment.completedLessons.some((id) => id.toString() === lessonId)
      ) {
        enrollment.completedLessons = enrollment.completedLessons.filter(
          (id) => id.toString() !== lessonId
        );
      }

      // Calculate progress
      const course = await Course.findById(enrollment.courseId);
      if (course) {
        const totalLessons = course.lessons.length;
        const completedCount = enrollment.completedLessons.length;
        enrollment.progress =
          totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;
      }

      enrollment.lastAccessedAt = new Date();
      await enrollment.save();

      // Populate courseId and instructorId for the response
      await enrollment.populate([
        {
          path: 'courseId',
          populate: {
            path: 'instructorId',
            select: 'firstName lastName email specialization',
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: enrollment,
      });
    }
  );

  // Unenroll from course
  static unenrollFromCourse = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const { enrollmentId } = req.params;
      const studentId = req.user?._id;

      if (!studentId) {
        res.status(401).json({
          error: { message: 'User not authenticated', statusCode: 401 },
        });
        return;
      }

      const enrollment = await Enrollment.findOne({
        _id: enrollmentId,
        studentId,
        isActive: true,
      });

      if (!enrollment) {
        res.status(404).json({
          error: { message: 'Enrollment not found', statusCode: 404 },
        });
        return;
      }

      enrollment.isActive = false;
      await enrollment.save();

      logger.info(
        `Student ${studentId} unenrolled from course ${enrollment.courseId}`
      );

      res.status(200).json({
        success: true,
        message: 'Successfully unenrolled from course',
      });
    }
  );

  // Get available courses (not enrolled)
  static getAvailableCourses = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const studentId = req.user?._id;

      if (!studentId) {
        res.status(401).json({
          error: { message: 'User not authenticated', statusCode: 401 },
        });
        return;
      }

      // Get student's enrolled course IDs
      const enrolledCourses = await Enrollment.find({
        studentId,
        isActive: true,
      }).select('courseId');

      const enrolledCourseIds = enrolledCourses.map(
        (enrollment) => enrollment.courseId
      );

      // Get available courses (published and not enrolled)
      const availableCourses = await Course.find({
        _id: { $nin: enrolledCourseIds },
        isPublished: true,
      }).populate({
        path: 'instructorId',
        select: 'firstName lastName specialization',
      });

      res.status(200).json({
        success: true,
        data: availableCourses,
      });
    }
  );
}
