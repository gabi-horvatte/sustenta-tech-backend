import { Request, Response } from 'express';
import GetActivityTemplate from '../../application/use-cases/GetActivityTemplate';
import { getActivityTemplateInputSchema } from '../../application/use-cases/GetActivityTemplate/dto';

export default class GetActivityTemplateController {
  constructor(private readonly getActivityTemplate: GetActivityTemplate) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = getActivityTemplateInputSchema.parse({ id: req.params.id });
      const result = await this.getActivityTemplate.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting activity template:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
