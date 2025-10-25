import { Request, Response } from "express";
import GetClassroomList from "../../../application/use-cases/Teacher/GetClassroomList";
import hasRole from '@/express/decorators/authorization/hasRole';

export default class GetClassroomListController {
  constructor(private readonly getClassroomList: GetClassroomList) { }

  @hasRole('TEACHER')
  async handle(_req: Request, res: Response) {
    const result = await this.getClassroomList.execute();
    res.status(200).json(result);
  }
}