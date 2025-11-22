import * as uuid from "uuid";
import UseCase from "../../../../../shared/base-use-case.js";
import { CreateStudentInput, CreateStudentOutput } from "./dto";
import StudentGateway from '../../../../datasource/Student/gateway';
import { Student } from '../../../../datasource/Student/model';
import { Account } from '../../../../../Authentication/datasource/Account/model.js';
import AccountGateway from '../../../../../Authentication/datasource/Account/gateway.js';

/**
 * Parses a date string (YYYY-MM-DD) into a Date object using local timezone.
 * This prevents timezone issues where dates are interpreted as UTC and shift to the previous day.
 */
function parseLocalDate(dateInput: Date | string): Date {
  if (dateInput instanceof Date) {
    // If already a Date object, extract the date components and create a new Date in local timezone
    const year = dateInput.getUTCFullYear();
    const month = dateInput.getUTCMonth();
    const day = dateInput.getUTCDate();
    return new Date(year, month, day);
  }

  // Parse date string (YYYY-MM-DD format)
  const dateStr = dateInput;
  const [year, month, day] = dateStr.split('-').map(Number);

  // Create Date object in local timezone (month is 0-indexed in JavaScript)
  return new Date(year, month - 1, day);
}

export default class CreateStudent extends UseCase<CreateStudentInput, CreateStudentOutput> {
  constructor(private readonly studentGateway: StudentGateway, private readonly accountGateway: AccountGateway) {
    super();
  }

  async execute(input: CreateStudentInput): Promise<CreateStudentOutput> {
    const id = input.id || uuid.v4();
    const birthDate = parseLocalDate(input.birth_date);

    const student: Omit<Student, 'created_at' | 'updated_at'> = {
      id,
      classroom_id: input.classroom_id,
      code: input.code,
    }

    const account: Omit<Account, 'created_at' | 'updated_at' | 'deleted_at'> = {
      id,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      password: input.password,
      phone: input.phone,
      role: 'STUDENT',
      birth_date: birthDate,
    };

    await this.accountGateway.insert(account);
    await this.studentGateway.insert(student);

    return {
      id,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      phone: input.phone,
      birth_date: birthDate,
      classroom_id: input.classroom_id,
      code: input.code,
    };
  }
}
