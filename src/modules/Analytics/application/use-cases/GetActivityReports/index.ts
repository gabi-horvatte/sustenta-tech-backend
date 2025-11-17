import UseCase from '@/modules/shared/base-use-case';
import { GetActivityReportsInput, GetActivityReportsOutput } from './dto';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import StudentAnswerGateway from '@/modules/ActivityTemplates/datasource/StudentAnswer/gateway';
import QuestionGateway from '@/modules/ActivityTemplates/datasource/Question/gateway';
import ActivityTemplateGateway from '@/modules/ActivityTemplates/datasource/ActivityTemplate/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';

export default class GetActivityReports extends UseCase<GetActivityReportsInput, GetActivityReportsOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly studentAnswerGateway: StudentAnswerGateway,
    private readonly questionGateway: QuestionGateway,
    private readonly activityTemplateGateway: ActivityTemplateGateway,
    private readonly classroomGateway: ClassroomGateway,
    private readonly studentGateway: StudentGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: GetActivityReportsInput): Promise<GetActivityReportsOutput> {
    // Get all activities created by this teacher
    const activities = await this.activityGateway.findByTeacherId(input.teacher_id);
    const activityIds = activities.map(a => a.id);

    if (activityIds.length === 0) {
      return this.getEmptyReport();
    }

    // Get all activity completions
    const completions = await this.activityStudentGateway.findByActivityIds(activityIds);
    const completedCompletions = completions.filter(c => c.completed_at);

    // Get all student answers for scoring
    const allAnswers = await this.studentAnswerGateway.findByActivityIds(activityIds);

    // Get all classrooms and students
    const classrooms = await this.classroomGateway.findAll();
    const students = await this.studentGateway.findAll();
    const accounts = await this.accountGateway.findByRole('STUDENT');

    // Calculate overview metrics
    const overview = await this.calculateOverview(activities, completedCompletions, allAnswers);

    // Calculate student rankings
    const studentRankings = await this.calculateStudentRankings(
      completedCompletions, allAnswers, students, accounts, activities.length
    );

    // Calculate classroom rankings
    const classroomRankings = await this.calculateClassroomRankings(
      activities, completedCompletions, allAnswers, classrooms, students
    );

    // Calculate activity effectiveness
    const activityEffectiveness = await this.calculateActivityEffectiveness(
      activities, completedCompletions, allAnswers
    );

    // Calculate question analysis
    const questionAnalysis = await this.calculateQuestionAnalysis(
      activities, allAnswers
    );

    // Calculate monthly trends
    const monthlyTrends = await this.calculateMonthlyTrends(completedCompletions, allAnswers);

    return {
      overview,
      student_rankings: studentRankings,
      classroom_rankings: classroomRankings,
      activity_effectiveness: activityEffectiveness,
      question_analysis: questionAnalysis,
      monthly_trends: monthlyTrends,
    };
  }

  private getEmptyReport(): GetActivityReportsOutput {
    return {
      overview: {
        total_activities: 0,
        total_completions: 0,
        average_score: 0,
        completion_rate: 0,
      },
      student_rankings: [],
      classroom_rankings: [],
      activity_effectiveness: [],
      question_analysis: [],
      monthly_trends: [],
    };
  }

  private async calculateOverview(activities: any[], completions: any[], answers: any[]) {
    const totalActivities = activities.length;
    const totalCompletions = completions.length;
    
    // Calculate average score from answers
    const scoresMap = new Map();
    answers.forEach(answer => {
      const key = `${answer.activity_id}-${answer.student_id}`;
      if (!scoresMap.has(key)) {
        scoresMap.set(key, { correct: 0, total: 0 });
      }
      const score = scoresMap.get(key);
      score.total++;
      if (answer.is_correct) score.correct++;
    });

    const scores = Array.from(scoresMap.values()).map(s => s.total > 0 ? (s.correct / s.total) * 100 : 0);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Calculate completion rate (total possible vs actual completions)
    // Get all students from all classrooms for this teacher's activities
    const allStudents = await this.studentGateway.findAll();
    const classroomIds = [...new Set(activities.map(a => a.classroom_id))];
    const relevantStudents = allStudents.filter(s => classroomIds.includes(s.classroom_id));
    
    const totalPossibleCompletions = activities.length * relevantStudents.length;
    const completionRate = totalPossibleCompletions > 0 ? (totalCompletions / totalPossibleCompletions) * 100 : 0;

    return {
      total_activities: totalActivities,
      total_completions: totalCompletions,
      average_score: Math.round(averageScore),
      completion_rate: Math.round(completionRate),
    };
  }

  private async calculateStudentRankings(completions: any[], answers: any[], students: any[], accounts: any[], totalActivities: number) {
    const studentStats = new Map();

    // Initialize student stats
    students.forEach(student => {
      const account = accounts.find(a => a.id === student.id);
      if (account) {
        studentStats.set(student.id, {
          student_id: student.id,
          student_name: `${account.name} ${account.last_name}`,
          total_activities: 0,
          total_correct: 0,
          total_questions: 0,
          completions: 0,
        });
      }
    });

    // Count completions
    completions.forEach(completion => {
      if (studentStats.has(completion.student_id)) {
        studentStats.get(completion.student_id).completions++;
      }
    });

    // Count answers and scores
    answers.forEach(answer => {
      if (studentStats.has(answer.student_id)) {
        const stats = studentStats.get(answer.student_id);
        stats.total_questions++;
        if (answer.is_correct) stats.total_correct++;
      }
    });

    // Calculate final metrics and sort
    return Array.from(studentStats.values())
      .map(stats => ({
        student_id: stats.student_id,
        student_name: stats.student_name,
        total_activities: stats.completions,
        average_score: stats.total_questions > 0 ? Math.round((stats.total_correct / stats.total_questions) * 100) : 0,
        completion_rate: totalActivities > 0 ? Math.round((stats.completions / totalActivities) * 100) : 0,
        total_correct_answers: stats.total_correct,
        total_questions: stats.total_questions,
      }))
      .sort((a, b) => b.average_score - a.average_score)
      .slice(0, 20); // Top 20 students
  }

  private async calculateClassroomRankings(activities: any[], completions: any[], answers: any[], classrooms: any[], students: any[]) {
    const classroomStats = new Map();

    // Initialize classroom stats
    classrooms.forEach(classroom => {
      classroomStats.set(classroom.id, {
        classroom_id: classroom.id,
        classroom_name: classroom.name,
        total_students: students.filter(s => s.classroom_id === classroom.id).length,
        total_completions: 0,
        total_correct: 0,
        total_questions: 0,
        activities: new Set(),
      });
    });

    // Count completions by classroom
    completions.forEach(completion => {
      const student = students.find(s => s.id === completion.student_id);
      if (student && classroomStats.has(student.classroom_id)) {
        const stats = classroomStats.get(student.classroom_id);
        stats.total_completions++;
        stats.activities.add(completion.activity_id);
      }
    });

    // Count answers by classroom
    answers.forEach(answer => {
      const student = students.find(s => s.id === answer.student_id);
      if (student && classroomStats.has(student.classroom_id)) {
        const stats = classroomStats.get(student.classroom_id);
        stats.total_questions++;
        if (answer.is_correct) stats.total_correct++;
      }
    });

    // Calculate final metrics and sort
    return Array.from(classroomStats.values())
      .map(stats => ({
        classroom_id: stats.classroom_id,
        classroom_name: stats.classroom_name,
        total_students: stats.total_students,
        average_score: stats.total_questions > 0 ? Math.round((stats.total_correct / stats.total_questions) * 100) : 0,
        completion_rate: stats.total_students > 0 && stats.activities.size > 0 ? 
          Math.round((stats.total_completions / (stats.total_students * stats.activities.size)) * 100) : 0,
        total_activities: stats.activities.size,
      }))
      .sort((a, b) => b.average_score - a.average_score);
  }

  private async calculateActivityEffectiveness(activities: any[], completions: any[], answers: any[]) {
    const activityStats = new Map();

    // Initialize activity stats
    for (const activity of activities) {
      const template = await this.activityTemplateGateway.findById({ id: activity.activity_template_id });
      activityStats.set(activity.id, {
        activity_id: activity.id,
        activity_name: activity.name,
        template_name: template?.name || 'Unknown',
        attempts: new Set(),
        completions: 0,
        total_correct: 0,
        total_questions: 0,
      });
    }

    // Count attempts and completions
    completions.forEach(completion => {
      if (activityStats.has(completion.activity_id)) {
        const stats = activityStats.get(completion.activity_id);
        stats.attempts.add(completion.student_id);
        if (completion.completed_at) stats.completions++;
      }
    });

    // Count answers
    answers.forEach(answer => {
      if (activityStats.has(answer.activity_id)) {
        const stats = activityStats.get(answer.activity_id);
        stats.total_questions++;
        if (answer.is_correct) stats.total_correct++;
      }
    });

    // Calculate final metrics
    return Array.from(activityStats.values())
      .map(stats => {
        const averageScore = stats.total_questions > 0 ? (stats.total_correct / stats.total_questions) * 100 : 0;
        const completionRate = stats.attempts.size > 0 ? (stats.completions / stats.attempts.size) * 100 : 0;
        
        return {
          activity_id: stats.activity_id,
          activity_name: stats.activity_name,
          template_name: stats.template_name,
          total_attempts: stats.attempts.size,
          completion_rate: Math.round(completionRate),
          average_score: Math.round(averageScore),
          difficulty_rating: averageScore >= 80 ? 'Easy' : averageScore >= 60 ? 'Medium' : 'Hard' as 'Easy' | 'Medium' | 'Hard',
        };
      })
      .sort((a, b) => b.total_attempts - a.total_attempts);
  }

  private async calculateQuestionAnalysis(activities: any[], answers: any[]) {
    const questionStats = new Map();

    // Get all questions for activities
    for (const activity of activities) {
      const questions = await this.questionGateway.findByActivityTemplateId(activity.activity_template_id);
      questions.forEach(question => {
        questionStats.set(question.id, {
          question_id: question.id,
          question_text: question.question_text,
          activity_name: activity.name,
          total_attempts: 0,
          correct_attempts: 0,
        });
      });
    }

    // Count answers
    answers.forEach(answer => {
      if (questionStats.has(answer.question_id)) {
        const stats = questionStats.get(answer.question_id);
        stats.total_attempts++;
        if (answer.is_correct) stats.correct_attempts++;
      }
    });

    // Calculate final metrics
    return Array.from(questionStats.values())
      .map(stats => {
        const correctRate = stats.total_attempts > 0 ? (stats.correct_attempts / stats.total_attempts) * 100 : 0;
        return {
          question_id: stats.question_id,
          question_text: stats.question_text.substring(0, 100) + (stats.question_text.length > 100 ? '...' : ''),
          activity_name: stats.activity_name,
          total_attempts: stats.total_attempts,
          correct_rate: Math.round(correctRate),
          difficulty_rating: correctRate >= 80 ? 'Easy' : correctRate >= 60 ? 'Medium' : 'Hard' as 'Easy' | 'Medium' | 'Hard',
        };
      })
      .filter(q => q.total_attempts > 0)
      .sort((a, b) => a.correct_rate - b.correct_rate)
      .slice(0, 20); // Top 20 most difficult questions
  }

  private async calculateMonthlyTrends(completions: any[], answers: any[]) {
    const monthlyStats = new Map();

    // Group completions by month
    completions.forEach(completion => {
      if (completion.completed_at) {
        const month = new Date(completion.completed_at).toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyStats.has(month)) {
          monthlyStats.set(month, {
            month,
            completions: 0,
            students: new Set(),
            total_correct: 0,
            total_questions: 0,
          });
        }
        const stats = monthlyStats.get(month);
        stats.completions++;
        stats.students.add(completion.student_id);
      }
    });

    // Add answer data
    answers.forEach(answer => {
      // Approximate month from activity completion (simplified)
      const completion = completions.find(c => c.activity_id === answer.activity_id && c.student_id === answer.student_id);
      if (completion && completion.completed_at) {
        const month = new Date(completion.completed_at).toISOString().substring(0, 7);
        if (monthlyStats.has(month)) {
          const stats = monthlyStats.get(month);
          stats.total_questions++;
          if (answer.is_correct) stats.total_correct++;
        }
      }
    });

    // Calculate final metrics
    return Array.from(monthlyStats.values())
      .map(stats => ({
        month: stats.month,
        total_completions: stats.completions,
        average_score: stats.total_questions > 0 ? Math.round((stats.total_correct / stats.total_questions) * 100) : 0,
        unique_students: stats.students.size,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}
