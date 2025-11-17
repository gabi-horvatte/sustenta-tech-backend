import UseCase from '@/modules/shared/base-use-case';
import { GetActivityReviewInput, GetActivityReviewOutput } from './dto';
import ActivityGateway from '../../../datasource/Activity/gateway';
import ActivityStudentGateway from '../../../datasource/ActivityStudent/gateway';
import ActivityTemplateGateway from '@/modules/ActivityTemplates/datasource/ActivityTemplate/gateway';
import QuestionGateway from '@/modules/ActivityTemplates/datasource/Question/gateway';
import QuestionOptionGateway from '@/modules/ActivityTemplates/datasource/QuestionOption/gateway';
import StudentAnswerGateway from '@/modules/ActivityTemplates/datasource/StudentAnswer/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';

export default class GetActivityReview extends UseCase<GetActivityReviewInput, GetActivityReviewOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly activityTemplateGateway: ActivityTemplateGateway,
    private readonly questionGateway: QuestionGateway,
    private readonly questionOptionGateway: QuestionOptionGateway,
    private readonly studentAnswerGateway: StudentAnswerGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: GetActivityReviewInput): Promise<GetActivityReviewOutput> {
    // Get the activity
    const activity = await this.activityGateway.findById({ id: input.activity_id });
    if (!activity) {
      return null;
    }

    // Get the activity student record to check if completed
    const activityStudent = await this.activityStudentGateway.findByActivityAndStudent(
      input.activity_id,
      input.student_id
    );
    if (!activityStudent || !activityStudent.completed_at) {
      return null; // Student hasn't completed the activity
    }

    // Get the activity template
    const template = await this.activityTemplateGateway.findById({ id: activity.activity_template_id });
    if (!template) {
      return null;
    }

    // Get student account info
    const studentAccount = await this.accountGateway.findById({ id: input.student_id });
    if (!studentAccount) {
      return null;
    }

    // Get all questions for this template
    const questions = await this.questionGateway.findByActivityTemplateId(activity.activity_template_id);
    
    // Get all options for these questions
    const questionIds = questions.map(q => q.id);
    const allOptions = await Promise.all(
      questionIds.map(qId => this.questionOptionGateway.findByQuestionId(qId))
    );
    
    // Get student answers for this activity
    const studentAnswers = await this.studentAnswerGateway.findByActivityAndStudent(
      input.activity_id,
      input.student_id
    );

    // Build questions with options
    const questionsWithOptions = questions.map(question => {
      const questionOptions = allOptions.find(options => 
        options.length > 0 && options[0].question_id === question.id
      ) || [];

      return {
        id: question.id,
        question_text: question.question_text,
        question_order: question.question_order,
        options: questionOptions.map(option => ({
          id: option.id,
          option_text: option.option_text,
          option_order: option.option_order,
          is_correct: option.is_correct,
        })),
      };
    });

    // Calculate score
    const totalQuestions = questions.length;
    const correctAnswers = studentAnswers.filter(answer => answer.is_correct).length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return {
      activity: {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        expires_at: activity.expires_at,
        activity_template_id: activity.activity_template_id,
      },
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        questions: questionsWithOptions,
      },
      student_name: `${studentAccount.name} ${studentAccount.last_name}`,
      student_id: input.student_id,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score_percentage: scorePercentage,
      completed_at: activityStudent.completed_at,
      answers: studentAnswers.map(answer => ({
        question_id: answer.question_id,
        selected_option_id: answer.selected_option_id || '',
        is_correct: answer.is_correct,
      })),
    };
  }
}