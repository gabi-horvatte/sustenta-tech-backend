export type StudentAnswer = {
  id: string;
  activity_id: string;
  student_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean;
  answered_at: Date;
};
