export type QuestionOption = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  option_order: number;
  created_at: Date;
  updated_at: Date;
};
