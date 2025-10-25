import { Request, Response } from "express";
import DeleteClassroom from "../../../application/use-cases/Manager/DeleteClassroom";
import { deleteClassroomInputSchema } from "../../../application/use-cases/Manager/DeleteClassroom/dto";
import isManager from '@/express/decorators/authorization/isManager';

export default class DeleteClassroomController {
  constructor(private readonly deleteClassroom: DeleteClassroom) { }

  @isManager()
  async handle(req: Request, res: Response) {
    const validatedInput = deleteClassroomInputSchema.parse({
      id: req.params.classroom_id,
    });
    const result = await this.deleteClassroom.execute(validatedInput);
    res.status(200).json(result);
  }
}