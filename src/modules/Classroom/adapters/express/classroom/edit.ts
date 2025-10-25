import { Request, Response } from "express";
import EditClassroom from "../../../application/use-cases/Manager/EditClassroom";
import { editClassroomInputSchema } from "../../../application/use-cases/Manager/EditClassroom/dto";
import hasRole from '@/express/decorators/authorization/hasRole';

export default class EditClassroomController {
  constructor(private readonly editClassroom: EditClassroom) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    const validatedInput = editClassroomInputSchema.parse({
      ...req.body,
      id: req.params.classroom_id,
    });
    const result = await this.editClassroom.execute(validatedInput);
    res.status(200).json(result);
  }
}