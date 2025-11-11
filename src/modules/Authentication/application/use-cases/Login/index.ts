import AccountGateway from '@/modules/Authentication/datasource/Account/gateway'
import UseCase from '@/modules/shared/base-use-case';
import { AccountNotFoundError, LoginInput, LoginOutput } from './dto';
import jwt from 'jsonwebtoken';
import TeacherGateway from '@/modules/Classroom/datasource/Teacher/gateway';
import bcrypt from 'bcrypt';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';

export default class Login extends UseCase<LoginInput, LoginOutput> {
  constructor(private readonly accountGateway: AccountGateway, private readonly teacherGateway: TeacherGateway, private readonly studentGateway: StudentGateway) {
    super();
  }

  async execute(input: LoginInput): Promise<LoginOutput> {
    const account = await this.accountGateway.findByEmailAndPassword({ email: input.email, password: input.password });
    if (!account) {
      throw new AccountNotFoundError();
    }

    const payload: {
      id: string,
      role: string,
      email: string,
      name: string,
      last_name: string,
      manager?: boolean,
      code?: string,
      phone: string,
      birth_date: Date,
      classroom_id?: string,
    } = {
      id: account.id,
      role: account.role,
      email: account.email,
      name: account.name,
      last_name: account.last_name,
      phone: account.phone,
      birth_date: account.birth_date,
    };

    if (account.role === 'TEACHER') {
      const teacher = await this.teacherGateway.findById({ id: account.id });
      if (!teacher) {
        throw new AccountNotFoundError();
      }
      payload.manager = teacher.manager;
    }

    if (account.role === 'STUDENT') {
      const student = await this.studentGateway.findById({ id: account.id });
      if (!student) {
        throw new AccountNotFoundError();
      }
      payload.code = student.code;
      payload.classroom_id = student.classroom_id;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { algorithm: 'HS256', expiresIn: '1h' });
    return {
      access_token: token,
    };
  }
}