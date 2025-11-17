import UseCase from '@/modules/shared/base-use-case';
import { ListStudentActivitiesWithScoresInput, ListStudentActivitiesWithScoresOutput } from './dto';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import StudentAnswerGateway from '@/modules/ActivityTemplates/datasource/StudentAnswer/gateway';
import QuestionGateway from '@/modules/ActivityTemplates/datasource/Question/gateway';

export default class ListStudentActivitiesWithScores extends UseCase<ListStudentActivitiesWithScoresInput, ListStudentActivitiesWithScoresOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly studentGateway: StudentGateway,
    private readonly studentAnswerGateway: StudentAnswerGateway,
    private readonly questionGateway: QuestionGateway,
  ) {
    super();
  }

  async execute(input: ListStudentActivitiesWithScoresInput): Promise<ListStudentActivitiesWithScoresOutput> {
    const student = await this.studentGateway.findById({ id: input.student_id });
    if (!student)
      throw new Error('Student not found');

    const activities = await this.activityGateway.findByClassroomId({ classroomId: student.classroom_id });
    const activityStudents = await this.activityStudentGateway.findByActivityIds(activities.map((activity) => activity.id));

    const result = [];

    for (const activity of activities) {
      const activityStudent = activityStudents.find((as) => as.activity_id === activity.id);
      
      // Get quiz scores if activity has a template
      let totalQuestions = 0;
      let correctAnswers = 0;
      let scorePercentage = 0;

      if (activity.activity_template_id) {
        try {
          const questions = await this.questionGateway.findByActivityTemplateId(activity.activity_template_id);
          totalQuestions = questions.length;

          if (totalQuestions > 0) {
            const studentAnswers = await this.studentAnswerGateway.findByActivityAndStudent(activity.id, input.student_id);
            correctAnswers = studentAnswers.filter(answer => answer.is_correct).length;
            scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
          }
        } catch (error) {
          console.error(`Error getting quiz scores for activity ${activity.id}:`, error);
          // Continue without scores if there's an error
        }
      }

      result.push({
        id: activity.id,
        activity_id: activity.id,
        student_id: input.student_id,
        completed_at: activityStudent?.completed_at || null,
        activity_name: activity.name,
        expires_at: activity.expires_at,
        description: activity.description,
        activity_template_id: activity.activity_template_id,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score_percentage: scorePercentage,
      });
    }

    return result;
  }
}
