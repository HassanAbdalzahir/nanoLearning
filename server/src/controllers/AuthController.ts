import { Request, Response, NextFunction } from 'express';
import { AuthViewModel } from '@/viewmodels/AuthViewModel';
import { createError } from '@/middleware/errorHandler';

const authVM = new AuthViewModel();

export class AuthController {
  signupStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const { user, token } = await authVM.signupStudent({
        firstName,
        lastName,
        email,
        password,
      });
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env['NODE_ENV'] === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(201)
        .json({ user, token });
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  signupTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        specialization,
        experience,
        bio,
        website,
        linkedin,
      } = req.body;
      const { user, token } = await authVM.signupTeacher({
        firstName,
        lastName,
        email,
        password,
        specialization,
        experience,
        bio,
        website,
        linkedin,
      });
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env['NODE_ENV'] === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(201)
        .json({ user, token });
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await authVM.login({ email, password });
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env['NODE_ENV'] === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(200)
        .json({ user, token });
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error('Email is required');
      }
      const result = await authVM.requestPasswordReset(email);
      res.status(200).json(result);
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  verifyResetCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, resetCode } = req.body;
      if (!email || !resetCode) {
        throw new Error('Email and reset code are required');
      }
      const result = await authVM.verifyResetCode(email, resetCode);
      res.status(200).json(result);
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, resetCode, newPassword } = req.body;
      if (!email || !resetCode || !newPassword) {
        throw new Error('Email, reset code, and new password are required');
      }
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      const result = await authVM.resetPassword(email, resetCode, newPassword);
      res.status(200).json(result);
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };

  // Keep the old signup method for backward compatibility
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role = 'student',
      } = req.body;

      if (role === 'teacher') {
        const { specialization, experience, bio, website, linkedin } = req.body;
        const { user, token } = await authVM.signupTeacher({
          firstName,
          lastName,
          email,
          password,
          specialization,
          experience,
          bio,
          website,
          linkedin,
        });
        res.status(201).json({ user, token });
      } else {
        const { user, token } = await authVM.signupStudent({
          firstName,
          lastName,
          email,
          password,
        });
        res.status(201).json({ user, token });
      }
    } catch (err: any) {
      next(createError(err.message, 400));
    }
  };
}
