import * as uuid from "uuid";
import UseCase from "../../../../../shared/base-use-case.js";
import { CreateTeacherInput, CreateTeacherOutput } from "./dto";
import TeacherGateway from '../../../../datasource/Teacher/gateway';
import { Teacher } from '../../../../datasource/Teacher/model';
import { Account } from '../../../../../Authentication/datasource/Account/model';
import AccountGateway from '../../../../../Authentication/datasource/Account/gateway';

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

export default class CreateTeacher extends UseCase<CreateTeacherInput, CreateTeacherOutput> {
  constructor(
    private readonly teacherGateway: TeacherGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: CreateTeacherInput): Promise<CreateTeacherOutput> {
    const id = input.id || uuid.v4();
    const birthDate = parseLocalDate(input.birth_date);

    const account: Omit<Account, 'created_at' | 'updated_at' | 'deleted_at'> = {
      id,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      password: input.password,
      phone: input.phone,
      role: 'TEACHER',
      birth_date: birthDate,
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
      birth_date: birthDate,
    };
  }
}
