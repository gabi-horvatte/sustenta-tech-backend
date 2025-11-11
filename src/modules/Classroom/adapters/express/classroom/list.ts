import { Request, Response } from "express";
import GetClassroomList from "../../../application/use-cases/Teacher/GetClassroomList";
import hasRole from '@/express/decorators/authorization/hasRole';

export default class GetClassroomListController {
  constructor(private readonly getClassroomList: GetClassroomList) { }

  @hasRole('TEACHER')
  async handle(_req: Request, res: Response) {
    console.log('get classroom list controller');
    const result = await this.getClassroomList.execute();
    console.log('get classroom list result', result);
    res.status(200).json(result);
  }
}