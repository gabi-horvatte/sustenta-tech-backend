import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import { GetStudentInput, GetStudentOutput } from './dto';
import UseCase from '@/modules/shared/base-use-case';

export default class GetStudent extends UseCase<GetStudentInput, GetStudentOutput> {
  constructor(private readonly studentGateway: StudentGateway) {
    super();
  }

  async execute(input: GetStudentInput): Promise<GetStudentOutput> {
    const student = await this.studentGateway.findById({ id: input.student_id });
    if (!student)
      return null;

    return student;
  }
}