import UseCase from "../../../../../shared/base-use-case.js";
import { EditClassroomInput, EditClassroomOutput } from "./dto.js";
import ClassroomGateway from '../../../../datasource/Classroom/gateway.js';

export default class EditClassroom extends UseCase<EditClassroomInput, EditClassroomOutput> {
  constructor(private readonly classroomGateway: ClassroomGateway) {
    super();
  }

  async execute(input: EditClassroomInput): Promise<EditClassroomOutput> {
    const classroom = {
      id: input.id,
      name: input.name,
      description: input.description,
    };

    await this.classroomGateway.update(classroom);

    return classroom;
  }
}