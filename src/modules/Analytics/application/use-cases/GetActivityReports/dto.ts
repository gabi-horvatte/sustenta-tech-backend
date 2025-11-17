import { z } from 'zod';

export const getActivityReportsInputSchema = z.object({
  teacher_id: z.string().min(1),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

export type GetActivityReportsInput = z.infer<typeof getActivityReportsInputSchema>;

export type GetActivityReportsOutput = {
  overview: {
    total_activities: number;
    total_completions: number;
    average_score: number;
    completion_rate: number;
  };
  student_rankings: {
    student_id: string;
    student_name: string;
    total_activities: number;
    average_score: number;
    completion_rate: number;
    total_correct_answers: number;
    total_questions: number;
  }[];
  classroom_rankings: {
    classroom_id: string;
    classroom_name: string;
    total_students: number;
    average_score: number;
    completion_rate: number;
    total_activities: number;
  }[];
  activity_effectiveness: {
    activity_id: string;
    activity_name: string;
    template_name: string;
    total_attempts: number;
    completion_rate: number;
    average_score: number;
    difficulty_rating: 'Easy' | 'Medium' | 'Hard';
  }[];
  question_analysis: {
    question_id: string;
    question_text: string;
    activity_name: string;
    total_attempts: number;
    correct_rate: number;
    difficulty_rating: 'Easy' | 'Medium' | 'Hard';
  }[];
  monthly_trends: {
    month: string;
    total_completions: number;
    average_score: number;
    unique_students: number;
  }[];
};
