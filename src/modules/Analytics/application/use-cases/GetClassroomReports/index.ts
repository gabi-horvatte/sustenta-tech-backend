import UseCase from '@/modules/shared/base-use-case';
import { GetClassroomReportsInput, GetClassroomReportsOutput } from './dto';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import StudentAnswerGateway from '@/modules/ActivityTemplates/datasource/StudentAnswer/gateway';
import MaterialAssignmentGateway from '@/modules/MaterialTemplates/datasource/MaterialAssignment/gateway';
import MaterialCompletionGateway from '@/modules/MaterialTemplates/datasource/MaterialCompletion/gateway';
import MaterialTemplateGateway from '@/modules/MaterialTemplates/datasource/MaterialTemplate/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';

export default class GetClassroomReports extends UseCase<GetClassroomReportsInput, GetClassroomReportsOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly studentAnswerGateway: StudentAnswerGateway,
    private readonly materialAssignmentGateway: MaterialAssignmentGateway,
    private readonly materialCompletionGateway: MaterialCompletionGateway,
    private readonly materialTemplateGateway: MaterialTemplateGateway,
    private readonly studentGateway: StudentGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: GetClassroomReportsInput): Promise<GetClassroomReportsOutput> {
    // Get classroom students
    const students = await this.studentGateway.findByClassroomId({ classroomId: input.classroom_id });
    const studentIds = students.map(s => s.id);
    
    if (studentIds.length === 0) {
      return this.getEmptyReport();
    }

    // Get student accounts for names
    const accounts = await this.accountGateway.findByRole('STUDENT');
    const studentAccounts = accounts.filter(acc => studentIds.includes(acc.id));

    // Get activities for this classroom
    const activities = await this.activityGateway.findByClassroomId({ classroomId: input.classroom_id });
    const activityIds = activities.map(a => a.id);

    // Get material assignments for this classroom
    const materialAssignments = await this.materialAssignmentGateway.findByClassroomId(input.classroom_id);
    const assignmentIds = materialAssignments.map(a => a.id);

    // Get activity completions and answers
    const activityCompletions = activityIds.length > 0 ? 
      await this.activityStudentGateway.findByActivityIds(activityIds) : [];
    const studentAnswers = activityIds.length > 0 ? 
      await this.studentAnswerGateway.findByActivityIds(activityIds) : [];

    // Get material completions
    const materialCompletions = assignmentIds.length > 0 ? 
      await this.materialCompletionGateway.findByAssignmentIds(assignmentIds) : [];

    // Get material templates
    const materialTemplateIds = [...new Set(materialAssignments.map(a => a.material_template_id))];
    const materialTemplates = await Promise.all(
      materialTemplateIds.map(id => this.materialTemplateGateway.findById({ id }))
    );

    // Calculate reports
    const overview = this.calculateOverview(
      students, activities, materialAssignments, activityCompletions, materialCompletions, studentAnswers
    );

    const studentPerformance = this.calculateStudentPerformance(
      students, studentAccounts, activities, materialAssignments, 
      activityCompletions, materialCompletions, studentAnswers
    );

    const activityPerformance = this.calculateActivityPerformance(
      activities, students, activityCompletions, studentAnswers
    );

    const materialEngagement = this.calculateMaterialEngagement(
      materialAssignments, materialTemplates.filter(Boolean), students, materialCompletions
    );

    const engagementTrends = this.calculateEngagementTrends(
      activityCompletions, materialCompletions
    );

    return {
      overview,
      student_performance: studentPerformance,
      activity_performance: activityPerformance,
      material_engagement: materialEngagement,
      engagement_trends: engagementTrends,
    };
  }

  private getEmptyReport(): GetClassroomReportsOutput {
    return {
      overview: {
        total_students: 0,
        total_activities: 0,
        total_materials: 0,
        avg_activity_score: 0,
        activity_completion_rate: 0,
        material_completion_rate: 0,
      },
      student_performance: [],
      activity_performance: [],
      material_engagement: [],
      engagement_trends: [],
    };
  }

  private calculateOverview(
    students: any[], activities: any[], materialAssignments: any[], 
    activityCompletions: any[], materialCompletions: any[], studentAnswers: any[]
  ) {
    const totalStudents = students.length;
    const totalActivities = activities.length;
    const totalMaterials = materialAssignments.length;

    // Calculate activity completion rate
    const totalPossibleActivityCompletions = totalStudents * totalActivities;
    const actualActivityCompletions = activityCompletions.filter(c => c.completed_at).length;
    const activityCompletionRate = totalPossibleActivityCompletions > 0 ? 
      (actualActivityCompletions / totalPossibleActivityCompletions) * 100 : 0;

    // Calculate material completion rate
    const totalPossibleMaterialCompletions = totalStudents * totalMaterials;
    const actualMaterialCompletions = materialCompletions.length;
    const materialCompletionRate = totalPossibleMaterialCompletions > 0 ? 
      (actualMaterialCompletions / totalPossibleMaterialCompletions) * 100 : 0;

    // Calculate average activity score
    const scoresMap = new Map();
    studentAnswers.forEach(answer => {
      const key = `${answer.activity_id}-${answer.student_id}`;
      if (!scoresMap.has(key)) {
        scoresMap.set(key, { correct: 0, total: 0 });
      }
      const score = scoresMap.get(key);
      score.total++;
      if (answer.is_correct) score.correct++;
    });

    const scores = Array.from(scoresMap.values()).map(s => s.total > 0 ? (s.correct / s.total) * 100 : 0);
    const avgActivityScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      total_students: totalStudents,
      total_activities: totalActivities,
      total_materials: totalMaterials,
      avg_activity_score: Math.round(avgActivityScore),
      activity_completion_rate: Math.round(activityCompletionRate),
      material_completion_rate: Math.round(materialCompletionRate),
    };
  }

  private calculateStudentPerformance(
    students: any[], accounts: any[], activities: any[], materialAssignments: any[],
    activityCompletions: any[], materialCompletions: any[], studentAnswers: any[]
  ) {
    return students.map(student => {
      const account = accounts.find(a => a.id === student.id);
      if (!account) return null;

      // Activity metrics
      const studentActivityCompletions = activityCompletions.filter(
        c => c.student_id === student.id && c.completed_at
      );
      const activitiesCompleted = studentActivityCompletions.length;
      const totalActivities = activities.length;
      const activityCompletionRate = totalActivities > 0 ? (activitiesCompleted / totalActivities) * 100 : 0;

      // Calculate student's average score
      const studentAnswersForStudent = studentAnswers.filter(a => a.student_id === student.id);
      const studentScoresMap = new Map();
      studentAnswersForStudent.forEach(answer => {
        const key = answer.activity_id;
        if (!studentScoresMap.has(key)) {
          studentScoresMap.set(key, { correct: 0, total: 0 });
        }
        const score = studentScoresMap.get(key);
        score.total++;
        if (answer.is_correct) score.correct++;
      });

      const studentScores = Array.from(studentScoresMap.values()).map(s => s.total > 0 ? (s.correct / s.total) * 100 : 0);
      const avgActivityScore = studentScores.length > 0 ? studentScores.reduce((a, b) => a + b, 0) / studentScores.length : 0;

      // Material metrics
      const studentMaterialCompletions = materialCompletions.filter(c => c.student_id === student.id);
      const materialsCompleted = studentMaterialCompletions.length;
      const totalMaterials = materialAssignments.length;
      const materialCompletionRate = totalMaterials > 0 ? (materialsCompleted / totalMaterials) * 100 : 0;

      // Overall engagement (average of activity and material completion rates)
      const overallEngagement = Math.round((activityCompletionRate + materialCompletionRate) / 2);

      return {
        student_id: student.id,
        student_name: `${account.name} ${account.last_name}`,
        activities_completed: activitiesCompleted,
        materials_completed: materialsCompleted,
        avg_activity_score: Math.round(avgActivityScore),
        total_activities: totalActivities,
        total_materials: totalMaterials,
        activity_completion_rate: Math.round(activityCompletionRate),
        material_completion_rate: Math.round(materialCompletionRate),
        overall_engagement: overallEngagement,
      };
    }).filter((student): student is NonNullable<typeof student> => student !== null).sort((a, b) => b.overall_engagement - a.overall_engagement);
  }

  private calculateActivityPerformance(
    activities: any[], students: any[], activityCompletions: any[], studentAnswers: any[]
  ) {
    return activities.map(activity => {
      const totalStudents = students.length;
      const activityCompletionsForActivity = activityCompletions.filter(
        c => c.activity_id === activity.id && c.completed_at
      );
      const completedStudents = activityCompletionsForActivity.length;
      const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

      // Calculate average score for this activity
      const activityAnswers = studentAnswers.filter(a => a.activity_id === activity.id);
      const scoresMap = new Map();
      activityAnswers.forEach(answer => {
        const key = answer.student_id;
        if (!scoresMap.has(key)) {
          scoresMap.set(key, { correct: 0, total: 0 });
        }
        const score = scoresMap.get(key);
        score.total++;
        if (answer.is_correct) score.correct++;
      });

      const scores = Array.from(scoresMap.values()).map(s => s.total > 0 ? (s.correct / s.total) * 100 : 0);
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      // Determine difficulty rating
      const difficultyRating = averageScore >= 80 ? 'Easy' : averageScore >= 60 ? 'Medium' : 'Hard';

      return {
        activity_id: activity.id,
        activity_name: activity.name,
        total_students: totalStudents,
        completed_students: completedStudents,
        completion_rate: Math.round(completionRate),
        average_score: Math.round(averageScore),
        difficulty_rating: difficultyRating as 'Easy' | 'Medium' | 'Hard',
      };
    }).sort((a, b) => b.completion_rate - a.completion_rate);
  }

  private calculateMaterialEngagement(
    materialAssignments: any[], materialTemplates: any[], students: any[], materialCompletions: any[]
  ) {
    return materialAssignments.map(assignment => {
      const template = materialTemplates.find(t => t?.id === assignment.material_template_id);
      if (!template) return null;

      const totalStudents = students.length;
      const assignmentCompletions = materialCompletions.filter(c => c.material_assignment_id === assignment.id);
      const completedStudents = assignmentCompletions.length;
      const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

      // Calculate average completion time
      const completionTimes = assignmentCompletions.map(completion => {
        const assignedDate = new Date(assignment.created_at);
        const completedDate = new Date(completion.completed_at);
        return (completedDate.getTime() - assignedDate.getTime()) / (1000 * 3600 * 24); // days
      });
      const avgCompletionTime = completionTimes.length > 0 ? 
        completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0;

      return {
        material_id: assignment.id,
        material_name: template.name,
        material_type: template.material_type,
        total_students: totalStudents,
        completed_students: completedStudents,
        completion_rate: Math.round(completionRate),
        avg_completion_time_days: Math.round(avgCompletionTime),
      };
    }).filter((material): material is NonNullable<typeof material> => material !== null).sort((a, b) => b.completion_rate - a.completion_rate);
  }

  private calculateEngagementTrends(activityCompletions: any[], materialCompletions: any[]) {
    const weeklyStats = new Map();

    // Process activity completions
    activityCompletions.forEach(completion => {
      if (completion.completed_at) {
        const date = new Date(completion.completed_at);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        const weekKey = weekStart.toISOString().substring(0, 10); // YYYY-MM-DD

        if (!weeklyStats.has(weekKey)) {
          weeklyStats.set(weekKey, {
            week: weekKey,
            activity_completions: 0,
            material_completions: 0,
            active_students: new Set(),
          });
        }
        const stats = weeklyStats.get(weekKey);
        stats.activity_completions++;
        stats.active_students.add(completion.student_id);
      }
    });

    // Process material completions
    materialCompletions.forEach(completion => {
      const date = new Date(completion.completed_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().substring(0, 10); // YYYY-MM-DD

      if (!weeklyStats.has(weekKey)) {
        weeklyStats.set(weekKey, {
          week: weekKey,
          activity_completions: 0,
          material_completions: 0,
          active_students: new Set(),
        });
      }
      const stats = weeklyStats.get(weekKey);
      stats.material_completions++;
      stats.active_students.add(completion.student_id);
    });

    // Convert to final format
    return Array.from(weeklyStats.values())
      .map(stats => ({
        week: stats.week,
        activity_completions: stats.activity_completions,
        material_completions: stats.material_completions,
        unique_active_students: stats.active_students.size,
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-8); // Last 8 weeks
  }
}
