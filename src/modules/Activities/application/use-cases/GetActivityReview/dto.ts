import { z } from 'zod';

export const getActivityReviewInputSchema = z.object({
  activity_id: z.string().min(1),
  student_id: z.string().min(1),
});

export type GetActivityReviewInput = z.infer<typeof getActivityReviewInputSchema>;

export type GetActivityReviewOutput = {
  activity: {
    id: string;
    name: string;
    description: string;
    expires_at: Date;
    activity_template_id: string;
  };
  template: {
    id: string;
    name: string;
    description: string;
    questions: {
      id: string;
      question_text: string;
      question_order: number;
      options: {
        id: string;
        option_text: string;
        option_order: number;
        is_correct: boolean;
      }[];
    }[];
  };
  student_name: string;
  student_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  completed_at: Date;
  answers: {
    question_id: string;
    selected_option_id: string;
    is_correct: boolean;
  }[];
} | null;
