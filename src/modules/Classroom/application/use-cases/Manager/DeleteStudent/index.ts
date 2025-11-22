import UseCase from "../../../../../shared/base-use-case.js";
import { DeleteStudentInput, DeleteStudentOutput } from "./dto.js";
import StudentGateway from '../../../../datasource/Student/gateway.js';
import AccountGateway from '../../../../../Authentication/datasource/Account/gateway.js';

export default class DeleteStudent extends UseCase<DeleteStudentInput, DeleteStudentOutput> {
  constructor(
    private readonly studentGateway: StudentGateway,
    private readonly accountGateway: AccountGateway
  ) {
    super();
  }

  async execute(input: DeleteStudentInput): Promise<DeleteStudentOutput> {
    const existingAccount = await this.accountGateway.findById({ id: input.id });
    const existingStudent = await this.studentGateway.findById({ id: input.id });

    if (!existingAccount || !existingStudent) {
      throw new Error('Student not found');
    }

    // Soft delete the account (sets deleted_at)
    await this.accountGateway.delete({ id: input.id });

    // Hard delete the student record since it's specific to the classroom
    await this.studentGateway.delete({ id: input.id });

    return {
      id: input.id,
    };
  }
}
