import { Request, Response } from "express";
import GetClassroom from "../../../application/use-cases/GetClassroom";

export default class GetClassroomController {
  constructor(private readonly getClassroom: GetClassroom) { }

  async handle(req: Request, res: Response) {
    const result = await this.getClassroom.execute({ id: req.params.classroom_id });
    if (!result)
      return res.status(404).json({ message: 'Classroom not found' });

    res.status(200).json(result);
  }
}