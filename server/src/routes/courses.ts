import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';

const router = Router();
const courseController = new CourseController();

// Public route for browsing published courses
router.get('/public', asyncHandler(courseController.getPublishedCourses));

// All other routes require authentication
router.use(auth);

// Course routes
router.post('/', asyncHandler(courseController.createCourse));
router.get('/', asyncHandler(courseController.getCoursesByInstructor));
router.get('/stats', asyncHandler(courseController.getCourseStats));
router.get('/:courseId', asyncHandler(courseController.getCourseById));
router.put('/:courseId', asyncHandler(courseController.updateCourse));
router.delete('/:courseId', asyncHandler(courseController.deleteCourse));
router.patch(
  '/:courseId/toggle-publish',
  asyncHandler(courseController.togglePublishStatus)
);

export default router;
