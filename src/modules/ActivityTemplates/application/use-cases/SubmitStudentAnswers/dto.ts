import { z } from 'zod';

export const submitStudentAnswersInputSchema = z.object({
  activity_id: z.string().min(1),
  student_id: z.string().min(1),
  answers: z.array(z.object({
    question_id: z.string().min(1),
    selected_option_id: z.string().min(1),
  })).min(1)
});

export type SubmitStudentAnswersInput = z.infer<typeof submitStudentAnswersInputSchema>;

export type SubmitStudentAnswersOutput = {
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  answers: {
    question_id: string;
    selected_option_id: string;
    is_correct: boolean;
  }[];
};
