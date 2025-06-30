import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  lessonId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
CommentSchema.index({ lessonId: 1, createdAt: -1 });
CommentSchema.index({ studentId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export interface CreateCommentData {
  lessonId: string;
  studentId: string;
  content: string;
}

export interface UpdateCommentData {
  content: string;
}
