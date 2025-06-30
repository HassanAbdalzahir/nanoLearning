import {
  User,
  IUser,
  CreateStudentData,
  CreateTeacherData,
} from '@/models/User';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/utils/email';
import type { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

export class AuthViewModel {
  async signupStudent(
    data: CreateStudentData
  ): Promise<{ user: IUser; token: string }> {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error('Email already in use');

    const user = new User({
      ...data,
      role: 'student',
    });
    await user.save();

    // Try to send welcome email, but don't fail if it doesn't work
    try {
      await sendWelcomeEmail(
        String(user.email),
        `${user.firstName} ${user.lastName}`
      );
    } catch (error) {
      console.warn('Failed to send welcome email:', error);
      // Don't throw error, continue with signup
    }

    const token = this.generateToken(String(user._id));
    return { user, token };
  }

  async signupTeacher(
    data: CreateTeacherData
  ): Promise<{ user: IUser; token: string }> {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error('Email already in use');

    const user = new User({
      ...data,
      role: 'teacher',
    });
    await user.save();

    // Try to send welcome email, but don't fail if it doesn't work
    try {
      await sendWelcomeEmail(
        String(user.email),
        `${user.firstName} ${user.lastName}`
      );
    } catch (error) {
      console.warn('Failed to send welcome email:', error);
      // Don't throw error, continue with signup
    }

    const token = this.generateToken(String(user._id));
    return { user, token };
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const valid = await user.comparePassword(password);
    if (!valid) throw new Error('Invalid credentials');
    const token = this.generateToken(String(user._id));
    return { user, token };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: 'If the email exists, a reset code has been sent.' };
    }

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the reset code for storage
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    // Set expiration (10 minutes from now)
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save the hashed reset code and expiration
    user.passwordResetToken = hashedResetCode;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send the reset code via email
    try {
      await sendPasswordResetEmail(
        user.email,
        resetCode,
        `${user.firstName} ${user.lastName}`
      );
    } catch (error) {
      // Clear the reset token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      throw new Error('Failed to send reset email');
    }

    return { message: 'If the email exists, a reset code has been sent.' };
  }

  async verifyResetCode(
    email: string,
    resetCode: string
  ): Promise<{ valid: boolean }> {
    const user = await User.findOne({ email });
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      return { valid: false };
    }

    // Check if reset code has expired
    if (user.passwordResetExpires < new Date()) {
      // Clear expired reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return { valid: false };
    }

    // Hash the provided reset code and compare
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
    const isValid = hashedResetCode === user.passwordResetToken;

    return { valid: isValid };
  }

  async resetPassword(
    email: string,
    resetCode: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    const user = await User.findOne({ email });
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      throw new Error('Invalid or expired reset code');
    }

    // Check if reset code has expired
    if (user.passwordResetExpires < new Date()) {
      // Clear expired reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      throw new Error('Reset code has expired');
    }

    // Hash the provided reset code and compare
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
    if (hashedResetCode !== user.passwordResetToken) {
      throw new Error('Invalid reset code');
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { success: true };
  }

  generateToken(userId: string) {
    const secret = process.env['JWT_SECRET'] || 'fallback_secret_key';
    const payload = { userId };
    const expiresIn =
      (process.env['JWT_EXPIRES_IN'] as SignOptions['expiresIn']) || '7d';
    return jwt.sign(payload, secret, { expiresIn });
  }

  // Keep the old signup method for backward compatibility
  async signup({
    firstName,
    lastName,
    email,
    password,
    role = 'student',
    specialization,
    experience,
    bio,
    website,
    linkedin,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'student' | 'teacher';
    specialization?: string;
    experience?: string;
    bio?: string;
    website?: string;
    linkedin?: string;
  }): Promise<{ user: IUser; token: string }> {
    if (role === 'teacher') {
      const teacherData: CreateTeacherData = {
        firstName,
        lastName,
        email,
        password,
        specialization: specialization!,
      };
      if (experience) teacherData.experience = experience;
      if (bio) teacherData.bio = bio;
      if (website) teacherData.website = website;
      if (linkedin) teacherData.linkedin = linkedin;

      return this.signupTeacher(teacherData);
    } else {
      return this.signupStudent({
        firstName,
        lastName,
        email,
        password,
      });
    }
  }
}
