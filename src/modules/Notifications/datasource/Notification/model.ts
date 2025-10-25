export type Notification = {
  id: string;
  account_id: string;
  message: string;
  url: string | null;
  creation_reason: string;
  created_by: string;

  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
};