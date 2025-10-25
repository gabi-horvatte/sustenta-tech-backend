export type Account = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  birth_date: Date;
  role: 'STUDENT' | 'TEACHER';
};