import TeacherGateway from '@/modules/Classroom/datasource/Teacher/gateway';
import { GetTeacherInput, GetTeacherOutput } from './dto';
import UseCase from '@/modules/shared/base-use-case';

export default class GetTeacher extends UseCase<GetTeacherInput, GetTeacherOutput> {
  constructor(private readonly teacherGateway: TeacherGateway) {
    super();
  }

  async execute(input: GetTeacherInput): Promise<GetTeacherOutput> {
    const teacher = await this.teacherGateway.findById({ id: input.teacher_id });
    if (!teacher)
      return null;

    return teacher;
  }
}