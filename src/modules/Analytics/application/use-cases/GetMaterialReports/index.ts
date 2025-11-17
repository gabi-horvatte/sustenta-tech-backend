import UseCase from '@/modules/shared/base-use-case';
import { GetMaterialReportsInput, GetMaterialReportsOutput } from './dto';
import MaterialTemplateGateway from '@/modules/MaterialTemplates/datasource/MaterialTemplate/gateway';
import MaterialAssignmentGateway from '@/modules/MaterialTemplates/datasource/MaterialAssignment/gateway';
import MaterialCompletionGateway from '@/modules/MaterialTemplates/datasource/MaterialCompletion/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';

export default class GetMaterialReports extends UseCase<GetMaterialReportsInput, GetMaterialReportsOutput> {
  constructor(
    private readonly materialTemplateGateway: MaterialTemplateGateway,
    private readonly materialAssignmentGateway: MaterialAssignmentGateway,
    private readonly materialCompletionGateway: MaterialCompletionGateway,
    private readonly classroomGateway: ClassroomGateway,
    private readonly studentGateway: StudentGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: GetMaterialReportsInput): Promise<GetMaterialReportsOutput> {
    // Get all material assignments created by this teacher
    const assignments = await this.materialAssignmentGateway.findByAssignedBy(input.teacher_id);
    const assignmentIds = assignments.map(a => a.id);

    if (assignmentIds.length === 0) {
      return this.getEmptyReport();
    }

    // Get all material templates
    const materialTemplates = await this.materialTemplateGateway.findAll();
    
    // Get all completions
    const completions = await this.materialCompletionGateway.findByAssignmentIds(assignmentIds);

    // Get all classrooms and students
    const classrooms = await this.classroomGateway.findAll();
    const students = await this.studentGateway.findAll();
    const accounts = await this.accountGateway.findByRole('STUDENT');

    // Calculate overview metrics
    const overview = await this.calculateOverview(materialTemplates, assignments, completions);

    // Calculate student engagement
    const studentEngagement = await this.calculateStudentEngagement(
      assignments, completions, students, accounts
    );

    // Calculate classroom engagement
    const classroomEngagement = await this.calculateClassroomEngagement(
      assignments, completions, classrooms, students
    );

    // Calculate material effectiveness
    const materialEffectiveness = await this.calculateMaterialEffectiveness(
      materialTemplates, assignments, completions
    );

    // Calculate material type analysis
    const materialTypeAnalysis = await this.calculateMaterialTypeAnalysis(
      materialTemplates, assignments, completions
    );

    // Calculate monthly trends
    const monthlyTrends = await this.calculateMonthlyTrends(assignments, completions);

    return {
      overview,
      student_engagement: studentEngagement,
      classroom_engagement: classroomEngagement,
      material_effectiveness: materialEffectiveness,
      material_type_analysis: materialTypeAnalysis,
      monthly_trends: monthlyTrends,
    };
  }

  private getEmptyReport(): GetMaterialReportsOutput {
    return {
      overview: {
        total_materials: 0,
        total_assignments: 0,
        total_completions: 0,
        completion_rate: 0,
      },
      student_engagement: [],
      classroom_engagement: [],
      material_effectiveness: [],
      material_type_analysis: [],
      monthly_trends: [],
    };
  }

  private async calculateOverview(templates: any[], assignments: any[], completions: any[]) {
    const totalMaterials = templates.length;
    const totalAssignments = assignments.length;
    const totalCompletions = completions.length;
    const completionRate = totalAssignments > 0 ? (totalCompletions / totalAssignments) * 100 : 0;

    return {
      total_materials: totalMaterials,
      total_assignments: totalAssignments,
      total_completions: totalCompletions,
      completion_rate: Math.round(completionRate),
    };
  }

  private async calculateStudentEngagement(assignments: any[], completions: any[], students: any[], accounts: any[]) {
    const studentStats = new Map();

    // Initialize student stats
    students.forEach(student => {
      const account = accounts.find(a => a.id === student.id);
      if (account) {
        studentStats.set(student.id, {
          student_id: student.id,
          student_name: `${account.name} ${account.last_name}`,
          total_materials: 0,
          completed_materials: 0,
          completion_times: [],
        });
      }
    });

    // Count assignments per student (based on classroom)
    assignments.forEach(assignment => {
      const classroomStudents = students.filter(s => s.classroom_id === assignment.classroom_id);
      classroomStudents.forEach(student => {
        if (studentStats.has(student.id)) {
          studentStats.get(student.id).total_materials++;
        }
      });
    });

    // Count completions and calculate completion times
    completions.forEach(completion => {
      const assignment = assignments.find(a => a.id === completion.material_assignment_id);
      if (assignment && studentStats.has(completion.student_id)) {
        const stats = studentStats.get(completion.student_id);
        stats.completed_materials++;
        
        // Calculate completion time in days
        const assignedDate = new Date(assignment.created_at);
        const completedDate = new Date(completion.completed_at);
        const timeDiff = (completedDate.getTime() - assignedDate.getTime()) / (1000 * 3600 * 24);
        stats.completion_times.push(timeDiff);
      }
    });

    // Calculate final metrics and sort
    return Array.from(studentStats.values())
      .map(stats => ({
        student_id: stats.student_id,
        student_name: stats.student_name,
        total_materials: stats.total_materials,
        completed_materials: stats.completed_materials,
        completion_rate: stats.total_materials > 0 ? Math.round((stats.completed_materials / stats.total_materials) * 100) : 0,
        avg_completion_time_days: stats.completion_times.length > 0 ? 
          Math.round(stats.completion_times.reduce((a: number, b: number) => a + b, 0) / stats.completion_times.length) : 0,
      }))
      .filter(s => s.total_materials > 0)
      .sort((a, b) => b.completion_rate - a.completion_rate)
      .slice(0, 20); // Top 20 students
  }

  private async calculateClassroomEngagement(assignments: any[], completions: any[], classrooms: any[], students: any[]) {
    const classroomStats = new Map();

    // Initialize classroom stats
    classrooms.forEach(classroom => {
      classroomStats.set(classroom.id, {
        classroom_id: classroom.id,
        classroom_name: classroom.name,
        total_students: students.filter(s => s.classroom_id === classroom.id).length,
        total_assignments: 0,
        total_completions: 0,
        completion_times: [],
      });
    });

    // Count assignments per classroom
    assignments.forEach(assignment => {
      if (classroomStats.has(assignment.classroom_id)) {
        const stats = classroomStats.get(assignment.classroom_id);
        stats.total_assignments++;
      }
    });

    // Count completions per classroom
    completions.forEach(completion => {
      const assignment = assignments.find(a => a.id === completion.material_assignment_id);
      if (assignment && classroomStats.has(assignment.classroom_id)) {
        const stats = classroomStats.get(assignment.classroom_id);
        stats.total_completions++;
        
        // Calculate completion time
        const assignedDate = new Date(assignment.created_at);
        const completedDate = new Date(completion.completed_at);
        const timeDiff = (completedDate.getTime() - assignedDate.getTime()) / (1000 * 3600 * 24);
        stats.completion_times.push(timeDiff);
      }
    });

    // Calculate final metrics and sort
    return Array.from(classroomStats.values())
      .map(stats => ({
        classroom_id: stats.classroom_id,
        classroom_name: stats.classroom_name,
        total_students: stats.total_students,
        total_assignments: stats.total_assignments,
        completion_rate: stats.total_assignments > 0 ? Math.round((stats.total_completions / stats.total_assignments) * 100) : 0,
        avg_completion_time_days: stats.completion_times.length > 0 ? 
          Math.round(stats.completion_times.reduce((a: number, b: number) => a + b, 0) / stats.completion_times.length) : 0,
      }))
      .filter(c => c.total_assignments > 0)
      .sort((a, b) => b.completion_rate - a.completion_rate);
  }

  private async calculateMaterialEffectiveness(templates: any[], assignments: any[], completions: any[]) {
    const materialStats = new Map();

    // Initialize material stats
    templates.forEach(template => {
      materialStats.set(template.id, {
        material_id: template.id,
        material_name: template.name,
        material_type: template.material_type,
        authors: template.authors,
        total_assignments: 0,
        total_completions: 0,
        completion_times: [],
      });
    });

    // Count assignments per material
    assignments.forEach(assignment => {
      if (materialStats.has(assignment.material_template_id)) {
        const stats = materialStats.get(assignment.material_template_id);
        stats.total_assignments++;
      }
    });

    // Count completions per material
    completions.forEach(completion => {
      const assignment = assignments.find(a => a.id === completion.material_assignment_id);
      if (assignment && materialStats.has(assignment.material_template_id)) {
        const stats = materialStats.get(assignment.material_template_id);
        stats.total_completions++;
        
        // Calculate completion time
        const assignedDate = new Date(assignment.created_at);
        const completedDate = new Date(completion.completed_at);
        const timeDiff = (completedDate.getTime() - assignedDate.getTime()) / (1000 * 3600 * 24);
        stats.completion_times.push(timeDiff);
      }
    });

    // Calculate final metrics
    return Array.from(materialStats.values())
      .map(stats => {
        const completionRate = stats.total_assignments > 0 ? (stats.total_completions / stats.total_assignments) * 100 : 0;
        const avgCompletionTime = stats.completion_times.length > 0 ? 
          stats.completion_times.reduce((a: number, b: number) => a + b, 0) / stats.completion_times.length : 0;
        
        return {
          material_id: stats.material_id,
          material_name: stats.material_name,
          material_type: stats.material_type,
          authors: stats.authors,
          total_assignments: stats.total_assignments,
          completion_rate: Math.round(completionRate),
          avg_completion_time_days: Math.round(avgCompletionTime),
          popularity_rating: stats.total_assignments >= 10 ? 'High' : 
                           stats.total_assignments >= 5 ? 'Medium' : 'Low' as 'High' | 'Medium' | 'Low',
        };
      })
      .filter(m => m.total_assignments > 0)
      .sort((a, b) => b.total_assignments - a.total_assignments);
  }

  private async calculateMaterialTypeAnalysis(templates: any[], assignments: any[], completions: any[]) {
    const typeStats = new Map();

    // Initialize type stats
    const materialTypes = [...new Set(templates.map(t => t.material_type))];
    materialTypes.forEach(type => {
      typeStats.set(type, {
        material_type: type,
        total_materials: 0,
        total_assignments: 0,
        total_completions: 0,
        completion_times: [],
      });
    });

    // Count materials per type
    templates.forEach(template => {
      if (typeStats.has(template.material_type)) {
        typeStats.get(template.material_type).total_materials++;
      }
    });

    // Count assignments per type
    assignments.forEach(assignment => {
      const template = templates.find(t => t.id === assignment.material_template_id);
      if (template && typeStats.has(template.material_type)) {
        const stats = typeStats.get(template.material_type);
        stats.total_assignments++;
      }
    });

    // Count completions per type
    completions.forEach(completion => {
      const assignment = assignments.find(a => a.id === completion.material_assignment_id);
      const template = assignment ? templates.find(t => t.id === assignment.material_template_id) : null;
      if (template && typeStats.has(template.material_type)) {
        const stats = typeStats.get(template.material_type);
        stats.total_completions++;
        
        // Calculate completion time
        const assignedDate = new Date(assignment.created_at);
        const completedDate = new Date(completion.completed_at);
        const timeDiff = (completedDate.getTime() - assignedDate.getTime()) / (1000 * 3600 * 24);
        stats.completion_times.push(timeDiff);
      }
    });

    // Calculate final metrics
    return Array.from(typeStats.values())
      .map(stats => ({
        material_type: stats.material_type,
        total_materials: stats.total_materials,
        completion_rate: stats.total_assignments > 0 ? Math.round((stats.total_completions / stats.total_assignments) * 100) : 0,
        avg_completion_time_days: stats.completion_times.length > 0 ? 
          Math.round(stats.completion_times.reduce((a: number, b: number) => a + b, 0) / stats.completion_times.length) : 0,
      }))
      .filter(t => t.total_materials > 0)
      .sort((a, b) => b.completion_rate - a.completion_rate);
  }

  private async calculateMonthlyTrends(assignments: any[], completions: any[]) {
    const monthlyStats = new Map();

    // Group assignments by month
    assignments.forEach(assignment => {
      const month = new Date(assignment.created_at).toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyStats.has(month)) {
        monthlyStats.set(month, {
          month,
          total_assignments: 0,
          total_completions: 0,
          students: new Set(),
        });
      }
      monthlyStats.get(month).total_assignments++;
    });

    // Group completions by month
    completions.forEach(completion => {
      const month = new Date(completion.completed_at).toISOString().substring(0, 7);
      if (!monthlyStats.has(month)) {
        monthlyStats.set(month, {
          month,
          total_assignments: 0,
          total_completions: 0,
          students: new Set(),
        });
      }
      const stats = monthlyStats.get(month);
      stats.total_completions++;
      stats.students.add(completion.student_id);
    });

    // Calculate final metrics
    return Array.from(monthlyStats.values())
      .map(stats => ({
        month: stats.month,
        total_assignments: stats.total_assignments,
        total_completions: stats.total_completions,
        completion_rate: stats.total_assignments > 0 ? Math.round((stats.total_completions / stats.total_assignments) * 100) : 0,
        unique_students: stats.students.size,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}
