-- Up Migration
ALTER TABLE account ADD COLUMN deleted_at TIMESTAMP NULL;

-- Down Migration
ALTER TABLE account DROP COLUMN deleted_at;
