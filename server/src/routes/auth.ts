import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const authController = new AuthController();

// General signup (supports both student and teacher with role parameter)
router.post('/signup', asyncHandler(authController.signup));

// Specific signup endpoints
router.post('/signup/student', asyncHandler(authController.signupStudent));
router.post('/signup/teacher', asyncHandler(authController.signupTeacher));

router.post('/login', asyncHandler(authController.login));

// Password reset routes
router.post(
  '/forgot-password',
  asyncHandler(authController.requestPasswordReset)
);
router.post('/verify-reset-code', asyncHandler(authController.verifyResetCode));
router.post('/reset-password', asyncHandler(authController.resetPassword));

export default router;
