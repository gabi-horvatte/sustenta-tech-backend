import UseCase from '@/modules/shared/base-use-case';
import { GetStudentProgressInput, GetStudentProgressOutput } from './dto';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import StudentAnswerGateway from '../../../datasource/StudentAnswer/gateway';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import QuestionGateway from '../../../datasource/Question/gateway';

export default class GetStudentProgress extends UseCase<GetStudentProgressInput, GetStudentProgressOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly studentAnswerGateway: StudentAnswerGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly studentGateway: StudentGateway,
    private readonly accountGateway: AccountGateway,
    private readonly questionGateway: QuestionGateway,
  ) {
    super();
  }

  async execute(input: GetStudentProgressInput): Promise<GetStudentProgressOutput> {
    // Get activity details
    const activity = await this.activityGateway.findById({ id: input.activity_id });
    if (!activity) {
      throw new Error('Activity not found');
    }

    // Get all students in the classroom
    const allStudents = await this.studentGateway.findByClassroomId({ classroomId: activity.classroom_id });
    
    // Get activity completion data
    const activityStudents = await this.activityStudentGateway.findByActivityId(input.activity_id);
    
    // Get all student answers for this activity
    const allAnswers = await this.studentAnswerGateway.findByActivity(input.activity_id);
    
    // Get total questions count
    const questions = activity.activity_template_id 
      ? await this.questionGateway.findByActivityTemplateId(activity.activity_template_id)
      : [];
    const totalQuestions = questions.length;

    const studentsProgress = [];

    for (const student of allStudents) {
      // Skip if filtering by specific student and this isn't the one
      if (input.student_id && student.id !== input.student_id) {
        continue;
      }

      const account = await this.accountGateway.findById({ id: student.id });
      const studentName = account ? `${account.name} ${account.last_name}` : 'Unknown';

      const activityStudent = activityStudents.find(as => as.student_id === student.id);
      const studentAnswers = allAnswers.filter((answer: any) => answer.student_id === student.id);
      
      const correctAnswers = studentAnswers.filter((answer: any) => answer.is_correct).length;
      const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      studentsProgress.push({
        student_id: student.id,
        student_name: studentName,
        completed_at: activityStudent?.completed_at || null,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score_percentage: scorePercentage,
      });
    }

    return {
      activity_id: activity.id,
      activity_name: activity.name,
      students: studentsProgress,
    };
  }
}
