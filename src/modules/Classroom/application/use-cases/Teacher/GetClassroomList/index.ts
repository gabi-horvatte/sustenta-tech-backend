import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway.js';
import UseCase from "../../../../../shared/base-use-case.js";
import { Classroom } from '@/modules/Classroom/datasource/Classroom/model.js';
import { GetClassroomListInput } from './dto';

export default class GetClassroomList extends UseCase<GetClassroomListInput, Classroom[]> {
  constructor(private readonly classroomGateway: ClassroomGateway) {
    super();
  }

  async execute(input: GetClassroomListInput): Promise<Classroom[]> {
    return this.classroomGateway.findByTeacherId({ teacher_id: input.teacher_id });
  }
} 