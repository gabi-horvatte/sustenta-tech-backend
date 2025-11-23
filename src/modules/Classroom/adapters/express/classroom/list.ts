import { Request, Response } from "express";
import GetClassroomList from "../../../application/use-cases/Teacher/GetClassroomList";
import hasRole from '@/server/decorators/authorization/hasRole';
import ListAllClassrooms from '../../../application/use-cases/Manager/ListAllClassrooms';

export default class GetClassroomListController {
  constructor(private readonly getClassroomList: GetClassroomList, private readonly listAllClassrooms: ListAllClassrooms) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    console.log('get classroom list controller');
    if (req.account?.role === 'TEACHER' && req.account?.manager) {
      const result = await this.listAllClassrooms.execute();
      console.log('list all classrooms result', result);
      res.status(200).json(result);
    } else {
      const result = await this.getClassroomList.execute({ teacher_id: req.account!.id });
      console.log('get classroom list result', result);
      res.status(200).json(result);
    }
  }
}