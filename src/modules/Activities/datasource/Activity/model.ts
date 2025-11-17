export type Activity = {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
  activity_template_id: string;
};