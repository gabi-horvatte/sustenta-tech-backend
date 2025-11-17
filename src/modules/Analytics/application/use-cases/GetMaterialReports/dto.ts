import { z } from 'zod';

export const getMaterialReportsInputSchema = z.object({
  teacher_id: z.string().min(1),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

export type GetMaterialReportsInput = z.infer<typeof getMaterialReportsInputSchema>;

export type GetMaterialReportsOutput = {
  overview: {
    total_materials: number;
    total_assignments: number;
    total_completions: number;
    completion_rate: number;
  };
  student_engagement: {
    student_id: string;
    student_name: string;
    total_materials: number;
    completed_materials: number;
    completion_rate: number;
    avg_completion_time_days: number;
  }[];
  classroom_engagement: {
    classroom_id: string;
    classroom_name: string;
    total_students: number;
    total_assignments: number;
    completion_rate: number;
    avg_completion_time_days: number;
  }[];
  material_effectiveness: {
    material_id: string;
    material_name: string;
    material_type: string;
    authors: string;
    total_assignments: number;
    completion_rate: number;
    avg_completion_time_days: number;
    popularity_rating: 'High' | 'Medium' | 'Low';
  }[];
  material_type_analysis: {
    material_type: string;
    total_materials: number;
    completion_rate: number;
    avg_completion_time_days: number;
  }[];
  monthly_trends: {
    month: string;
    total_assignments: number;
    total_completions: number;
    completion_rate: number;
    unique_students: number;
  }[];
};
