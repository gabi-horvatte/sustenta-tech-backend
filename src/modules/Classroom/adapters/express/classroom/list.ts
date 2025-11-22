import { Request, Response } from "express";
import GetClassroomList from "../../../application/use-cases/Teacher/GetClassroomList";
import hasRole from '@/server/decorators/authorization/hasRole';

export default class GetClassroomListController {
  constructor(private readonly getClassroomList: GetClassroomList) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    console.log('get classroom list controller');
    const result = await this.getClassroomList.execute({ teacher_id: req.account!.id });
    console.log('get classroom list result', result);
    res.status(200).json(result);
  }
}