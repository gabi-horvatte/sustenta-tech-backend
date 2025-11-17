import UseCase from '@/modules/shared/base-use-case';
import { ListActivityTemplatesInput, ListActivityTemplatesOutput } from './dto';
import ActivityTemplateGateway from '../../../datasource/ActivityTemplate/gateway';
import QuestionGateway from '../../../datasource/Question/gateway';

export default class ListActivityTemplates extends UseCase<ListActivityTemplatesInput, ListActivityTemplatesOutput> {
  constructor(
    private readonly activityTemplateGateway: ActivityTemplateGateway,
    private readonly questionGateway: QuestionGateway,
  ) {
    super();
  }

  async execute(input: ListActivityTemplatesInput): Promise<ListActivityTemplatesOutput> {
    const templates = input.created_by 
      ? await this.activityTemplateGateway.findByCreatedBy(input.created_by)
      : await this.activityTemplateGateway.findAll();

    const result = [];
    
    for (const template of templates) {
      const questions = await this.questionGateway.findByActivityTemplateId(template.id);
      
      result.push({
        id: template.id,
        name: template.name,
        description: template.description,
        created_by: template.created_by,
        created_at: template.created_at,
        question_count: questions.length,
      });
    }

    return result;
  }
}
