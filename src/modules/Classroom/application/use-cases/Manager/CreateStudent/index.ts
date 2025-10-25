import * as uuid from "uuid";
import UseCase from "../../../../../shared/base-use-case.js";
import { CreateStudentInput, CreateStudentOutput } from "./dto";
import StudentGateway from '../../../../datasource/Student/gateway';
import { Student } from '../../../../datasource/Student/model';
import { Account } from '../../../../../Authentication/datasource/Account/model.js';
import AccountGateway from '../../../../../Authentication/datasource/Account/gateway.js';

export default class CreateStudent extends UseCase<CreateStudentInput, CreateStudentOutput> {
  constructor(private readonly studentGateway: StudentGateway, private readonly accountGateway: AccountGateway) {
    super();
  }

  async execute(input: CreateStudentInput): Promise<CreateStudentOutput> {
    const id = input.id || uuid.v4();

    const student: Omit<Student, 'created_at' | 'updated_at'> = {
      id,
      classroom_id: input.classroom_id,
      code: input.code,
    }

    const account: Omit<Account, 'created_at' | 'updated_at'> = {
      id,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      password: input.password,
      phone: input.phone,
      role: 'STUDENT',
      birth_date: new Date(input.birth_date),
    };

    await this.accountGateway.insert(account);
    await this.studentGateway.insert(student);

    return {
      id,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      phone: input.phone,
      birth_date: new Date(input.birth_date),
      classroom_id: input.classroom_id,
      code: input.code,
    };
  }
}
