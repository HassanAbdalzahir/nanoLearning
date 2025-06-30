import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String },
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
