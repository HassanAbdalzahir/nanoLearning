import { Router } from 'express';
import { LessonController } from '../controllers/LessonController';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';

const router = Router();
const lessonController = new LessonController();

// All routes require authentication
router.use(auth);

// Lesson routes
router.post('/', asyncHandler(lessonController.createLesson));
router.get(
  '/course/:courseId',
  asyncHandler(lessonController.getLessonsByCourse)
);
router.get('/:lessonId', asyncHandler(lessonController.getLessonById));
router.put('/:lessonId', asyncHandler(lessonController.updateLesson));
router.delete('/:lessonId', asyncHandler(lessonController.deleteLesson));
router.post(
  '/course/:courseId/reorder',
  asyncHandler(lessonController.reorderLessons)
);
router.get(
  '/course/:courseId/next-order',
  asyncHandler(lessonController.getNextLessonOrder)
);
router.get(
  '/enrollment/:enrollmentId',
  auth,
  asyncHandler(lessonController.getLessonsByEnrollment)
);

export default router;
