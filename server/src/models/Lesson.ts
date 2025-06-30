import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  contentType: 'video' | 'text';
  content: string; // Video URL (uploaded or external) or text content
  description: string;
  attachment?: string; // URL to uploaded attachment
  courseId: mongoose.Types.ObjectId;
  order: number;
  comments: mongoose.Types.ObjectId[];
  videoDuration?: number; // Duration in seconds for uploaded videos
  videoThumbnail?: string; // Thumbnail URL for uploaded videos
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ['video', 'text'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    attachment: {
      type: String,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    videoDuration: {
      type: Number,
      min: 0,
    },
    videoThumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
LessonSchema.index({ courseId: 1, order: 1 });
LessonSchema.index({ courseId: 1, createdAt: -1 });

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);

export interface CreateLessonData {
  title: string;
  contentType: 'video' | 'text';
  content: string;
  description: string;
  attachment?: string;
  courseId: string;
  order: number;
  videoDuration?: number;
  videoThumbnail?: string;
}

export interface UpdateLessonData {
  title?: string;
  contentType?: 'video' | 'text';
  content?: string;
  description?: string;
  attachment?: string;
  order?: number;
  videoDuration?: number;
  videoThumbnail?: string;
}
