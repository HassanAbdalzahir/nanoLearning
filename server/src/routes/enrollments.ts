import { Router } from 'express';
import { EnrollmentController } from '../controllers/EnrollmentController';
import { auth } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(auth);

// Enroll in a course
router.post('/courses/:courseId/enroll', EnrollmentController.enrollInCourse);

// Get student's enrollments
router.get('/', EnrollmentController.getStudentEnrollments);

// Get enrollment details with course and lessons
router.get('/:enrollmentId', EnrollmentController.getEnrollmentDetails);

// Update enrollment progress
router.patch('/:enrollmentId/progress', EnrollmentController.updateProgress);

// Unenroll from course
router.delete('/:enrollmentId', EnrollmentController.unenrollFromCourse);

// Get available courses (not enrolled)
router.get('/courses/available', EnrollmentController.getAvailableCourses);

export default router;
