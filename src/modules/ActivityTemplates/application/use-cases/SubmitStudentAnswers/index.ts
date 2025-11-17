import UseCase from '@/modules/shared/base-use-case';
import { SubmitStudentAnswersInput, SubmitStudentAnswersOutput } from './dto';
import StudentAnswerGateway from '../../../datasource/StudentAnswer/gateway';
import QuestionOptionGateway from '../../../datasource/QuestionOption/gateway';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';
import { v4 as uuidv4 } from 'uuid';

export default class SubmitStudentAnswers extends UseCase<SubmitStudentAnswersInput, SubmitStudentAnswersOutput> {
  constructor(
    private readonly studentAnswerGateway: StudentAnswerGateway,
    private readonly questionOptionGateway: QuestionOptionGateway,
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly accountGateway: AccountGateway,
    private readonly classroomGateway: ClassroomGateway,
  ) {
    super();
  }

  async execute(input: SubmitStudentAnswersInput): Promise<SubmitStudentAnswersOutput> {
    // Verify activity exists
    const activity = await this.activityGateway.findById({ id: input.activity_id });
    if (!activity) {
      throw new Error('Activity not found');
    }

    const answers = [];
    let correctCount = 0;

    // Process each answer
    for (const answerData of input.answers) {
      const selectedOption = await this.questionOptionGateway.findById({ id: answerData.selected_option_id });
      if (!selectedOption) {
        throw new Error(`Option not found: ${answerData.selected_option_id}`);
      }

      const isCorrect = selectedOption.is_correct;
      if (isCorrect) {
        correctCount++;
      }

      // Save student answer
      const studentAnswer = {
        id: uuidv4(),
        activity_id: input.activity_id,
        student_id: input.student_id,
        question_id: answerData.question_id,
        selected_option_id: answerData.selected_option_id,
        is_correct: isCorrect,
      };

      await this.studentAnswerGateway.upsert(studentAnswer);

      answers.push({
        question_id: answerData.question_id,
        selected_option_id: answerData.selected_option_id,
        is_correct: isCorrect,
      });
    }

    // Mark activity as completed for the student
    const existingActivityStudent = await this.activityStudentGateway.findByActivityAndStudent(input.activity_id, input.student_id);
    if (!existingActivityStudent) {
      await this.activityStudentGateway.insert({
        activity_id: input.activity_id,
        student_id: input.student_id,
        completed_at: new Date(),
      });
    } else {
      await this.activityStudentGateway.update({
        activity_id: input.activity_id,
        student_id: input.student_id,
        completed_at: new Date(),
      });
    }

    const totalQuestions = input.answers.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Create notification for teacher
    try {
      const student = await this.accountGateway.findById({ id: input.student_id });
      const classroom = await this.classroomGateway.findById({ id: activity.classroom_id });
      
      if (student && classroom) {
        await this.notificationGateway.insert({
          id: uuidv4(),
          account_id: activity.teacher_id,
          message: `${student.name} ${student.last_name} concluiu o quiz "${activity.name}" com ${scorePercentage}% de acertos`,
          url: `/management/activities/activity/${input.activity_id}?name=${encodeURIComponent(activity.name)}&description=${encodeURIComponent(activity.description)}&classroom_name=${encodeURIComponent(classroom.name)}`,
          creation_reason: 'QUIZ_SUBMITTED',
          created_by: input.student_id,
          read_at: null,
        });
      }
    } catch (error) {
      console.error('Failed to create quiz submission notification:', error);
      // Don't fail the entire operation if notification fails
    }

    return {
      total_questions: totalQuestions,
      correct_answers: correctCount,
      score_percentage: scorePercentage,
      answers,
    };
  }
}
