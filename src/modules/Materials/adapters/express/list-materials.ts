import { Request, Response } from "express";
import { listStudentMaterialsInputSchema } from '../../application/use-cases/ListStudentMaterials/dto';
import ListStudentMaterials from '../../application/use-cases/ListStudentMaterials';
import GetStudentMaterial from '../../application/use-cases/GetStudentMaterial';
import { getStudentMaterialInputSchema } from '../../application/use-cases/GetStudentMaterial/dto';

export default class ListStudentMaterialsController {
  constructor(
    private readonly listStudentMaterials: ListStudentMaterials,
    private readonly getStudentMaterial: GetStudentMaterial
  ) { }

  async handle(req: Request, res: Response) {
    const student_id = req.account!.role === 'STUDENT' ? req.account!.id : req.query.student_id;

    if (!student_id)
      return res.status(400).json({ message: "Student ID is required." });

    const id = req.query.id;

    if (id) {
      const validatedInput = getStudentMaterialInputSchema.parse({
        student_id,
        id,
      });
      const result = await this.getStudentMaterial.execute(validatedInput);
      res.status(200).json(result);
      return;
    }

    const validatedInput = listStudentMaterialsInputSchema.parse({
      student_id,
    });
    const result = await this.listStudentMaterials.execute(validatedInput);
    res.status(200).json(result);
  }
}