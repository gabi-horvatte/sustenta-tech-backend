import * as uuid from "uuid";
import UseCase from "../../../../../shared/base-use-case.js";
import { CreateTeacherInput, CreateTeacherOutput } from "./dto";
import TeacherGateway from '../../../../datasource/Teacher/gateway';
import { Teacher } from '../../../../datasource/Teacher/model';
import { Account } from '../../../../../Authentication/datasource/Account/model';
import AccountGateway from '../../../../../Authentication/datasource/Account/gateway';

export default class CreateTeacher extends UseCase<CreateTeacherInput, CreateTeacherOutput> {
  constructor(
    private readonly teacherGateway: TeacherGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: CreateTeacherInput): Promise<CreateTeacherOutput> {
    const id = input.id || uuid.v4();

    const account: Omit<Account, 'created_at' | 'updated_at'> = {
      id,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      password: input.password,
      phone: input.phone,
      role: 'TEACHER',
      birth_date: new Date(input.birth_date),
    };

    const teacher: Omit<Teacher, 'created_at' | 'updated_at'> = {
      id,
      manager: input.manager,
    };


    await this.accountGateway.insert(account);
    await this.teacherGateway.insert(teacher);

    return {
      id,
      manager: input.manager,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      phone: input.phone,
      birth_date: new Date(input.birth_date),
    };
  }
}
