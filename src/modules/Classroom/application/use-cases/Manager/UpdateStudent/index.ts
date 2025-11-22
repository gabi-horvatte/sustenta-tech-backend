import UseCase from "../../../../../shared/base-use-case.js";
import { UpdateStudentInput, UpdateStudentOutput } from "./dto.js";
import StudentGateway from '../../../../datasource/Student/gateway.js';
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

export default class UpdateStudent extends UseCase<UpdateStudentInput, UpdateStudentOutput> {
  constructor(
    private readonly studentGateway: StudentGateway,
    private readonly accountGateway: AccountGateway
  ) {
    super();
  }

  async execute(input: UpdateStudentInput): Promise<UpdateStudentOutput> {
    const existingAccount = await this.accountGateway.findById({ id: input.id });
    const existingStudent = await this.studentGateway.findById({ id: input.id });
    if (!existingAccount || !existingStudent) {
      throw new Error('Account not found');
    }

    const birthDate = input.birth_date ? parseLocalDate(input.birth_date) : existingAccount.birth_date;

    const student = {
      id: input.id,
      classroom_id: input.classroom_id ?? existingStudent.classroom_id,
      code: input.code ?? existingStudent.code,
    };

    const account = {
      id: input.id,
      name: input.name ?? existingAccount.name,
      last_name: input.last_name ?? existingAccount.last_name,
      email: input.email ?? existingAccount.email,
      phone: input.phone ?? existingAccount.phone,
      role: 'STUDENT' as const,
      birth_date: birthDate,
      password: existingAccount.password,
    };

    // Update both student and account records
    await this.studentGateway.update(student);
    await this.accountGateway.update(account);

    return {
      id: input.id,
      classroom_id: input.classroom_id ?? existingStudent?.classroom_id,
      code: input.code ?? existingStudent?.code,
      name: input.name ?? existingAccount.name,
      last_name: input.last_name ?? existingAccount.last_name,
      email: input.email ?? existingAccount.email,
      phone: input.phone ?? existingAccount.phone,
      birth_date: birthDate,
    };
  }
}
