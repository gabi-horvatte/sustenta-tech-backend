import * as uuid from "uuid";
import UseCase from "../../../../../shared/base-use-case.js";
import { CreateClassroomInput, CreateClassroomOutput } from "./dto";
import ClassroomGateway from '../../../../datasource/Classroom/gateway';
import ClassroomTeacherGateway from '../../../../datasource/ClassroomTeacher/gateway';

export default class CreateClassroom extends UseCase<CreateClassroomInput, CreateClassroomOutput> {
  constructor(private readonly classroomGateway: ClassroomGateway, private readonly classroomTeacherGateway: ClassroomTeacherGateway) {
    super();
  }

  async execute(input: CreateClassroomInput): Promise<CreateClassroomOutput> {
    const id = input.id || uuid.v4();

    const classroom = {
      id,
      name: input.name,
      description: input.description,
    }

    await this.classroomGateway.insert(classroom);
    await this.classroomTeacherGateway.insert({
      classroom_id: id,
      teacher_id: input.teacher_id,
    });

    return {
      id,
      name: input.name,
      description: input.description,
      teacher_id: input.teacher_id,
    };
  }
}