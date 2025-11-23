-- Up Migration
ALTER TABLE material_template ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE activity_template ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE material ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE activity ADD COLUMN deleted_at TIMESTAMP NULL;

-- Down Migration
ALTER TABLE material_template DROP COLUMN deleted_at;
ALTER TABLE activity_template DROP COLUMN deleted_at;
ALTER TABLE material DROP COLUMN deleted_at;
ALTER TABLE activity DROP COLUMN deleted_at;
