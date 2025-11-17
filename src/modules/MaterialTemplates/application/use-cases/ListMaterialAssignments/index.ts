import UseCase from '@/modules/shared/base-use-case';
import { ListMaterialAssignmentsInput, ListMaterialAssignmentsOutput } from './dto';
import MaterialAssignmentGateway from '../../../datasource/MaterialAssignment/gateway';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';

export default class ListMaterialAssignments extends UseCase<ListMaterialAssignmentsInput, ListMaterialAssignmentsOutput> {
  constructor(
    private readonly materialAssignmentGateway: MaterialAssignmentGateway,
    private readonly materialTemplateGateway: MaterialTemplateGateway,
    private readonly classroomGateway: ClassroomGateway,
  ) {
    super();
  }

  async execute(input: ListMaterialAssignmentsInput): Promise<ListMaterialAssignmentsOutput> {
    let assignments;
    
    if (input.classroom_id) {
      assignments = await this.materialAssignmentGateway.findByClassroomId(input.classroom_id);
    } else if (input.assigned_by) {
      assignments = await this.materialAssignmentGateway.findByAssignedBy(input.assigned_by);
    } else {
      // If no filter provided, return all assignments (useful for admin or direct access)
      assignments = await this.materialAssignmentGateway.findAll();
    }

    const result = [];
    
    for (const assignment of assignments) {
      const template = await this.materialTemplateGateway.findById({ id: assignment.material_template_id });
      const classroom = await this.classroomGateway.findById({ id: assignment.classroom_id });
      
      if (!template || !classroom) continue;

      result.push({
        id: assignment.id,
        name: template.name,
        description: template.description,
        authors: template.authors,
        url: template.url,
        material_type: template.material_type,
        expires_at: assignment.expires_at,
        created_at: assignment.created_at,
        classroom_id: assignment.classroom_id,
        classroom_name: classroom.name,
      });
    }

    return result.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }
}
