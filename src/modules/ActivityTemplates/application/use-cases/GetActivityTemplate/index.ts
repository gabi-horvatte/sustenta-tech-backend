import UseCase from '@/modules/shared/base-use-case';
import { GetActivityTemplateInput, GetActivityTemplateOutput } from './dto';
import ActivityTemplateGateway from '../../../datasource/ActivityTemplate/gateway';
import QuestionGateway from '../../../datasource/Question/gateway';
import QuestionOptionGateway from '../../../datasource/QuestionOption/gateway';

export default class GetActivityTemplate extends UseCase<GetActivityTemplateInput, GetActivityTemplateOutput> {
  constructor(
    private readonly activityTemplateGateway: ActivityTemplateGateway,
    private readonly questionGateway: QuestionGateway,
    private readonly questionOptionGateway: QuestionOptionGateway,
  ) {
    super();
  }

  async execute(input: GetActivityTemplateInput): Promise<GetActivityTemplateOutput> {
    const template = await this.activityTemplateGateway.findById({ id: input.id });
    if (!template) {
      throw new Error('Activity template not found');
    }

    const questions = await this.questionGateway.findByActivityTemplateId(template.id);
    const questionIds = questions.map((q: any) => q.id);
    const allOptions = await this.questionOptionGateway.findByQuestionIds(questionIds);

    const questionsWithOptions = questions.map((question: any) => {
      const questionOptions = allOptions
        .filter((option: any) => option.question_id === question.id)
        .sort((a: any, b: any) => a.option_order - b.option_order);

      return {
        id: question.id,
        question_text: question.question_text,
        question_order: question.question_order,
        options: questionOptions.map((option: any) => ({
          id: option.id,
          option_text: option.option_text,
          option_order: option.option_order,
          is_correct: option.is_correct,
        })),
      };
    }).sort((a: any, b: any) => a.question_order - b.question_order);

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      created_by: template.created_by,
      created_at: template.created_at,
      questions: questionsWithOptions,
    };
  }
}
