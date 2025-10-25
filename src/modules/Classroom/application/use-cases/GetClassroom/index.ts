import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway.js';
import UseCase from "../../../../shared/base-use-case.js";
import { GetClassroomInput, GetClassroomOutput } from './dto.js';

export default class GetClassroom extends UseCase<GetClassroomInput, GetClassroomOutput> {
  constructor(private readonly classroomGateway: ClassroomGateway) {
    super();
  }

  async execute(input: GetClassroomInput): Promise<GetClassroomOutput> {
    const classroom = await this.classroomGateway.findById({ id: input.id });
    if (!classroom) return null;

    return classroom;
  }
} 