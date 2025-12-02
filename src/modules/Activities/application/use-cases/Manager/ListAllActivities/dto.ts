export type ListAllActivitiesOutput = {
  id: string;
  name: string;
  description: string;
  activity_template_id: string;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}[];