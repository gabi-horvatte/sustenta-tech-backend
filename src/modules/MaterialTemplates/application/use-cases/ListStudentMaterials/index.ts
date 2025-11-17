import UseCase from '@/modules/shared/base-use-case';
import { ListStudentMaterialsInput, ListStudentMaterialsOutput } from './dto';
import MaterialAssignmentGateway from '../../../datasource/MaterialAssignment/gateway';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';
import MaterialCompletionGateway from '../../../datasource/MaterialCompletion/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';

export default class ListStudentMaterials extends UseCase<ListStudentMaterialsInput, ListStudentMaterialsOutput> {
  constructor(
    private readonly materialAssignmentGateway: MaterialAssignmentGateway,
    private readonly materialTemplateGateway: MaterialTemplateGateway,
    private readonly materialCompletionGateway: MaterialCompletionGateway,
    private readonly studentGateway: StudentGateway,
  ) {
    super();
  }

  async execute(input: ListStudentMaterialsInput): Promise<ListStudentMaterialsOutput> {
    // Verify student exists and get their classroom
    const student = await this.studentGateway.findById({ id: input.student_id });
    if (!student) {
      throw new Error('Student not found');
    }

    // Get all material assignments for the student's classroom
    const assignments = await this.materialAssignmentGateway.findByClassroomId(student.classroom_id);
    
    // Get all material templates for these assignments
    const templateIds = assignments.map((a: any) => a.material_template_id);
    const templates = await Promise.all(
      templateIds.map((id: any) => this.materialTemplateGateway.findById({ id }))
    );

    // Get all completions for this student
    const completions = await this.materialCompletionGateway.findByStudentId(input.student_id);

    const result = [];
    
    for (const assignment of assignments) {
      const template = templates.find((t: any) => t?.id === assignment.material_template_id);
      if (!template) continue;

      const completion = completions.find(c => c.material_assignment_id === assignment.id);

      result.push({
        assignment_id: assignment.id,
        material_id: template.id,
        name: template.name,
        description: template.description,
        authors: template.authors,
        url: template.url,
        thumbnail: template.thumbnail,
        material_type: template.material_type,
        expires_at: assignment.expires_at,
        completed_at: completion?.completed_at || null,
      });
    }

    return result.sort((a, b) => b.expires_at.getTime() - a.expires_at.getTime());
  }
}
