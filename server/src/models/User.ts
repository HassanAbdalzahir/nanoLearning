import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  avatar?: string;
  // Teacher-specific fields
  specialization?: string;
  experience?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  // Student-specific fields
  enrolledCourses?: mongoose.Types.ObjectId[];
  passwordResetToken?: string | undefined;
  passwordResetExpires?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  avatar: { type: String },
  // Teacher-specific fields
  specialization: { type: String },
  experience: { type: String },
  bio: { type: String },
  website: { type: String },
  linkedin: { type: String },
  // Student-specific fields
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  passwordResetToken: { type: String, required: false },
  passwordResetExpires: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this['password'] = await bcrypt.hash(this['password'], 10);
  next();
});

UserSchema.methods['comparePassword'] = function (candidate: string) {
  return bcrypt.compare(candidate, this['password']);
};

export const User = mongoose.model<IUser>('User', UserSchema);

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  specialization: string;
  experience?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
}
