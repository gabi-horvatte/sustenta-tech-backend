import UseCase from '@/modules/shared/base-use-case';
import { UpdateActivityTemplateInput, UpdateActivityTemplateOutput } from './dto';
import ActivityTemplateGateway from '../../../datasource/ActivityTemplate/gateway';
import QuestionGateway from '../../../datasource/Question/gateway';
import QuestionOptionGateway from '../../../datasource/QuestionOption/gateway';
import { v4 as uuidv4 } from 'uuid';

export default class UpdateActivityTemplate extends UseCase<UpdateActivityTemplateInput, UpdateActivityTemplateOutput> {
  constructor(
    private readonly activityTemplateGateway: ActivityTemplateGateway,
    private readonly questionGateway: QuestionGateway,
    private readonly questionOptionGateway: QuestionOptionGateway,
  ) {
    super();
  }

  async execute(input: UpdateActivityTemplateInput): Promise<UpdateActivityTemplateOutput> {
    // Check if the template exists
    const existingTemplate = await this.activityTemplateGateway.findById({ id: input.id });
    if (!existingTemplate) {
      throw new Error('Activity template not found');
    }

    // Update the activity template
    const activityTemplate = {
      id: input.id,
      name: input.name,
      description: input.description,
      created_by: existingTemplate.created_by, // Keep the original creator
    };

    await this.activityTemplateGateway.update(activityTemplate);

    // Get existing questions for this template
    const existingQuestions = await this.questionGateway.findByActivityTemplateId(input.id);

    // Create maps for easier lookup
    const existingQuestionsMap = new Map(existingQuestions.map(q => [q.id, q]));
    const inputQuestionsMap = new Map(input.questions.filter(q => q.id).map(q => [q.id!, q]));

    // Questions to update, create, and delete
    const questionsToUpdate = input.questions.filter(q => q.id && existingQuestionsMap.has(q.id));
    const questionsToCreate = input.questions.filter(q => !q.id);
    const questionsToDelete = existingQuestions.filter(q => !inputQuestionsMap.has(q.id));

    // Delete questions that are no longer present
    for (const question of questionsToDelete) {
      await this.questionOptionGateway.deleteByQuestionId(question.id);
      await this.questionGateway.delete({ id: question.id });
    }

    // Update existing questions
    for (const questionData of questionsToUpdate) {
      const question = {
        id: questionData.id!,
        activity_template_id: input.id,
        question_text: questionData.question_text,
        question_order: questionData.question_order,
      };

      await this.questionGateway.update(question);

      // Handle options for this question
      await this.updateQuestionOptions(question.id, questionData.options);
    }

    // Create new questions
    for (const questionData of questionsToCreate) {
      const questionId = uuidv4();

      const question = {
        id: questionId,
        activity_template_id: input.id,
        question_text: questionData.question_text,
        question_order: questionData.question_order,
      };

      await this.questionGateway.insert(question);

      // Create options for this new question
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

    const updatedTemplate = await this.activityTemplateGateway.findById({ id: input.id });
    if (!updatedTemplate) {
      throw new Error('Failed to update activity template');
    }

    return {
      id: updatedTemplate.id,
      name: updatedTemplate.name,
      description: updatedTemplate.description,
      created_by: updatedTemplate.created_by,
      created_at: updatedTemplate.created_at,
      updated_at: updatedTemplate.updated_at,
    };
  }

  private async updateQuestionOptions(questionId: string, inputOptions: Array<{
    id?: string;
    option_text: string;
    option_order: number;
    is_correct: boolean;
  }>) {
    // Get existing options for this question
    const existingOptions = await this.questionOptionGateway.findByQuestionId(questionId);

    // Create maps for easier lookup
    const existingOptionsMap = new Map(existingOptions.map(o => [o.id, o]));
    const inputOptionsMap = new Map(inputOptions.filter(o => o.id).map(o => [o.id!, o]));

    // Options to update, create, and delete
    const optionsToUpdate = inputOptions.filter(o => o.id && existingOptionsMap.has(o.id));
    const optionsToCreate = inputOptions.filter(o => !o.id);
    const optionsToDelete = existingOptions.filter(o => !inputOptionsMap.has(o.id));

    // Delete options that are no longer present
    for (const option of optionsToDelete) {
      await this.questionOptionGateway.delete({ id: option.id });
    }

    // Update existing options
    for (const optionData of optionsToUpdate) {
      const option = {
        id: optionData.id!,
        question_id: questionId,
        option_text: optionData.option_text,
        option_order: optionData.option_order,
        is_correct: optionData.is_correct,
      };

      await this.questionOptionGateway.update(option);
    }

    // Create new options
    for (const optionData of optionsToCreate) {
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
}
