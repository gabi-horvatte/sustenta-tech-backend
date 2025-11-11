-- Up Migration
CREATE TABLE activity (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  classroom_id TEXT NOT NULL REFERENCES classroom(id),
  teacher_id TEXT NOT NULL REFERENCES teacher(id),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_student (
  activity_id TEXT NOT NULL REFERENCES activity(id),
  student_id TEXT NOT NULL REFERENCES student(id),
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
DROP TABLE activity_student;
DROP TABLE activity;