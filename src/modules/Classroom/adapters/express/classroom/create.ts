import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import CreateClassroom from "../../../application/use-cases/Manager/CreateClassroom";
import { createClassroomInputSchema } from "../../../application/use-cases/Manager/CreateClassroom/dto";
import isManager from '@/server/decorators/authorization/isManager';

export default class CreateClassroomController {
  constructor(private readonly createClassroom: CreateClassroom) { }

  @isManager()
  async handle(req: Request, res: Response, next?: NextFunction) {
    const validatedInput = createClassroomInputSchema.parse(req.body);
    const result = await this.createClassroom.execute(validatedInput);
    res.status(201).json(result);
  }
}