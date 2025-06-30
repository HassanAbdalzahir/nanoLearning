import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // 0-100 percentage
  completedLessons: mongoose.Types.ObjectId[];
  isActive: boolean;
  lastAccessedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a student can only enroll once per course
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>(
  'Enrollment',
  enrollmentSchema
);
