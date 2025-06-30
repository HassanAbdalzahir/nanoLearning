import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IExam extends Document {
  title: string;
  questions: Types.ObjectId[];
  courseId: Types.ObjectId;
}

const ExamSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  { timestamps: true }
);

export const Exam = mongoose.model<IExam>('Exam', ExamSchema);
