import UseCase from "../../../../../shared/base-use-case.js";
import { DeleteClassroomInput, DeleteClassroomOutput } from "./dto.js";
import ClassroomGateway from '../../../../datasource/Classroom/gateway.js';

export default class DeleteClassroom extends UseCase<DeleteClassroomInput, DeleteClassroomOutput> {
  constructor(private readonly classroomGateway: ClassroomGateway) {
    super();
  }

  async execute(input: DeleteClassroomInput): Promise<DeleteClassroomOutput> {
    await this.classroomGateway.delete({ id: input.id });

    return { id: input.id };
  }
}