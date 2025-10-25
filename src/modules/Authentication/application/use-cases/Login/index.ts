import AccountGateway from '@/modules/Authentication/datasource/Account/gateway'
import UseCase from '@/modules/shared/base-use-case';
import { AccountNotFoundError, LoginInput, LoginOutput } from './dto';
import jwt from 'jsonwebtoken';
import TeacherGateway from '@/modules/Classroom/datasource/Teacher/gateway';
import bcrypt from 'bcrypt';

export default class Login extends UseCase<LoginInput, LoginOutput> {
  constructor(private readonly accountGateway: AccountGateway, private readonly teacherGateway: TeacherGateway) {
    super();
  }

  async execute(input: LoginInput): Promise<LoginOutput> {
    const account = await this.accountGateway.findByEmailAndPassword({ email: input.email, password: input.password });
    if (!account) {
      throw new AccountNotFoundError();
    }

    const payload: { id: string, role: string, manager?: boolean } = {
      id: account.id,
      role: account.role,
    };

    if (account.role === 'TEACHER') {
      const teacher = await this.teacherGateway.findById({ id: account.id });
      if (!teacher) {
        throw new AccountNotFoundError();
      }
      payload.manager = teacher.manager;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { algorithm: 'HS256', expiresIn: '1h' });
    return {
      access_token: token,
    };
  }
}