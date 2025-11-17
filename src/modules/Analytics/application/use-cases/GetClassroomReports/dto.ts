import { z } from 'zod';

export const getClassroomReportsInputSchema = z.object({
  teacher_id: z.string().min(1),
  classroom_id: z.string().min(1),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

export type GetClassroomReportsInput = z.infer<typeof getClassroomReportsInputSchema>;

export type GetClassroomReportsOutput = {
  overview: {
    total_students: number;
    total_activities: number;
    total_materials: number;
    avg_activity_score: number;
    activity_completion_rate: number;
    material_completion_rate: number;
  };
  student_performance: {
    student_id: string;
    student_name: string;
    activities_completed: number;
    materials_completed: number;
    avg_activity_score: number;
    total_activities: number;
    total_materials: number;
    activity_completion_rate: number;
    material_completion_rate: number;
    overall_engagement: number;
  }[];
  activity_performance: {
    activity_id: string;
    activity_name: string;
    total_students: number;
    completed_students: number;
    completion_rate: number;
    average_score: number;
    difficulty_rating: 'Easy' | 'Medium' | 'Hard';
  }[];
  material_engagement: {
    material_id: string;
    material_name: string;
    material_type: string;
    total_students: number;
    completed_students: number;
    completion_rate: number;
    avg_completion_time_days: number;
  }[];
  engagement_trends: {
    week: string;
    activity_completions: number;
    material_completions: number;
    unique_active_students: number;
  }[];
};
