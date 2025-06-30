import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  coverImage: string;
  price: number;
  type: 'video' | 'text';
  isPublished: boolean;
  instructorId: mongoose.Types.ObjectId;
  lessons: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Programming',
        'Design',
        'Business',
        'Marketing',
        'Finance',
        'Health & Fitness',
        'Music',
        'Photography',
        'Language',
        'Technology',
        'Other',
      ],
    },
    coverImage: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    type: {
      type: String,
      enum: ['video', 'text'],
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
CourseSchema.index({ instructorId: 1, createdAt: -1 });
CourseSchema.index({ isPublished: 1, category: 1 });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  coverImage: string;
  price?: number;
  type: 'video' | 'text';
  instructorId: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  price?: number;
  type?: 'video' | 'text';
  isPublished?: boolean;
}
