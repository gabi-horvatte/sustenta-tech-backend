-- Up Migration

-- Activity templates table for reusable quiz activities
CREATE TABLE activity_template (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES teacher(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Questions table for multiple choice questions
CREATE TABLE question (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_template_id TEXT NOT NULL REFERENCES activity_template(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Question options table for answer choices
CREATE TABLE question_option (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL REFERENCES question(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  option_order INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Student answers table to track responses
CREATE TABLE student_answer (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id TEXT NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES question(id) ON DELETE CASCADE,
  selected_option_id TEXT REFERENCES question_option(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(activity_id, student_id, question_id)
);

-- Material templates table for teacher-created materials
CREATE TABLE material_template (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  authors TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  material_type VARCHAR(50) NOT NULL DEFAULT 'video',
  created_by TEXT NOT NULL REFERENCES teacher(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Material assignments table for classroom assignments
CREATE TABLE material_assignment (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  material_template_id TEXT NOT NULL REFERENCES material_template(id) ON DELETE CASCADE,
  classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
  assigned_by TEXT NOT NULL REFERENCES teacher(id),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Update activity table to use templates instead of URLs
ALTER TABLE activity DROP COLUMN url;
ALTER TABLE activity ADD COLUMN activity_template_id TEXT NOT NULL REFERENCES activity_template(id) ON DELETE CASCADE;

-- Drop the old material table and recreate with new structure
DROP TABLE material;
CREATE TABLE material_completion (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  material_assignment_id TEXT NOT NULL REFERENCES material_assignment(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(material_assignment_id, student_id)
);

-- Create indexes for better performance
CREATE INDEX idx_question_activity_template ON question(activity_template_id);
CREATE INDEX idx_question_option_question ON question_option(question_id);
CREATE INDEX idx_student_answer_activity ON student_answer(activity_id);
CREATE INDEX idx_student_answer_student ON student_answer(student_id);
CREATE INDEX idx_material_assignment_classroom ON material_assignment(classroom_id);
CREATE INDEX idx_material_completion_assignment ON material_completion(material_assignment_id);

-- Down Migration
DROP INDEX idx_material_completion_assignment;
DROP INDEX idx_material_assignment_classroom;
DROP INDEX idx_student_answer_student;
DROP INDEX idx_student_answer_activity;
DROP INDEX idx_question_option_question;
DROP INDEX idx_question_activity_template;

DROP TABLE material_completion;
DROP TABLE material_assignment;
DROP TABLE material_template;
DROP TABLE student_answer;
DROP TABLE question_option;
DROP TABLE question;
DROP TABLE activity_template;

-- Restore original activity table structure
ALTER TABLE activity DROP COLUMN activity_template_id;
ALTER TABLE activity ADD COLUMN url TEXT NOT NULL;

-- Restore original material table
CREATE TABLE material (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES student(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);