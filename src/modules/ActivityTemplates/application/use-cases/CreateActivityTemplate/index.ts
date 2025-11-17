import UseCase from '@/modules/shared/base-use-case';
import { CreateActivityTemplateInput, CreateActivityTemplateOutput } from './dto';
import ActivityTemplateGateway from '../../../datasource/ActivityTemplate/gateway';
import QuestionGateway from '../../../datasource/Question/gateway';
import QuestionOptionGateway from '../../../datasource/QuestionOption/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import { v4 as uuidv4 } from 'uuid';

export default class CreateActivityTemplate extends UseCase<CreateActivityTemplateInput, CreateActivityTemplateOutput> {
  constructor(
    private readonly activityTemplateGateway: ActivityTemplateGateway,
    private readonly questionGateway: QuestionGateway,
    private readonly questionOptionGateway: QuestionOptionGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: CreateActivityTemplateInput): Promise<CreateActivityTemplateOutput> {
    const activityTemplateId = uuidv4();
    
    // Create activity template
    const activityTemplate = {
      id: activityTemplateId,
      name: input.name,
      description: input.description,
      created_by: input.created_by,
    };

    await this.activityTemplateGateway.insert(activityTemplate);

    // Create questions and options
    for (const questionData of input.questions) {
      const questionId = uuidv4();
      
      const question = {
        id: questionId,
        activity_template_id: activityTemplateId,
        question_text: questionData.question_text,
        question_order: questionData.question_order,
      };

      await this.questionGateway.insert(question);

      // Create options for this question
      for (const optionData of questionData.options) {
        const optionId = uuidv4();
        
        const option = {
          id: optionId,
          question_id: questionId,
          option_text: optionData.option_text,
          option_order: optionData.option_order,
          is_correct: optionData.is_correct,
        };

        await this.questionOptionGateway.insert(option);
      }
    }

    const createdTemplate = await this.activityTemplateGateway.findById({ id: activityTemplateId });
    if (!createdTemplate) {
      throw new Error('Failed to create activity template');
    }

    // Create notifications for all other teachers
    try {
      const creator = await this.accountGateway.findById({ id: input.created_by });
      const allTeachers = await this.accountGateway.findByRole('TEACHER');
      
      if (creator && allTeachers) {
        const otherTeachers = allTeachers.filter(teacher => teacher.id !== input.created_by);
        
        await Promise.all(otherTeachers.map(teacher => 
          this.notificationGateway.insert({
            id: uuidv4(),
            account_id: teacher.id,
            message: `${creator.name} ${creator.last_name} criou um novo modelo de quiz: "${input.name}"`,
            url: `/management/activity-templates/${activityTemplateId}`,
            creation_reason: 'ACTIVITY_TEMPLATE_CREATED',
            created_by: input.created_by,
            read_at: null,
          })
        ));
      }
    } catch (error) {
      console.error('Failed to create activity template notifications:', error);
      // Don't fail the entire operation if notification fails
    }

    return {
      id: createdTemplate.id,
      name: createdTemplate.name,
      description: createdTemplate.description,
      created_by: createdTemplate.created_by,
      created_at: createdTemplate.created_at,
    };
  }
}
