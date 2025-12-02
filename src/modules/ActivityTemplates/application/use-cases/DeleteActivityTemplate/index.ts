import UseCase from '@/modules/shared/base-use-case';
import { DeleteActivityTemplateInput, DeleteActivityTemplateOutput } from './dto';
import ActivityTemplateGateway from '../../../datasource/ActivityTemplate/gateway';

export default class DeleteActivityTemplate extends UseCase<DeleteActivityTemplateInput, DeleteActivityTemplateOutput> {
  constructor(
    private readonly activityTemplateGateway: ActivityTemplateGateway
  ) {
    super();
  }

  async execute(input: DeleteActivityTemplateInput): Promise<DeleteActivityTemplateOutput> {
    const existingTemplate = await this.activityTemplateGateway.findById({ id: input.id });
    if (!existingTemplate) {
      throw new Error('Activity template not found');
    }

    await this.activityTemplateGateway.delete({ id: input.id });

    return {
      id: input.id,
    };
  }
}


