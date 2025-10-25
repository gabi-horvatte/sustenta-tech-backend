-- Up Migration
CREATE TABLE notification (
  id TEXT NOT NULL PRIMARY KEY,
  account_id TEXT NOT NULL,
  message TEXT NOT NULL,
  url TEXT,
  creation_reason TEXT NOT NULL,
  created_by TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE notification ADD CONSTRAINT fk_notification_account FOREIGN KEY (account_id) REFERENCES account(id);
ALTER TABLE notification ADD CONSTRAINT fk_notification_created_by FOREIGN KEY (created_by) REFERENCES account(id);
CREATE INDEX idx_notification_read_at ON notification (read_at);
CREATE INDEX idx_notification_created_at ON notification (created_at);
CREATE INDEX idx_notification_updated_at ON notification (updated_at);
CREATE INDEX idx_notification_creation_reason ON notification (creation_reason);

-- Down Migration
DROP TABLE notification;