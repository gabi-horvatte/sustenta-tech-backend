import UseCase from '@/modules/shared/base-use-case';
import { AssignMaterialInput, AssignMaterialOutput } from './dto';
import MaterialAssignmentGateway from '../../../datasource/MaterialAssignment/gateway';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import { v4 as uuidv4 } from 'uuid';

export default class AssignMaterial extends UseCase<AssignMaterialInput, AssignMaterialOutput> {
  constructor(
    private readonly materialAssignmentGateway: MaterialAssignmentGateway,
    private readonly materialTemplateGateway: MaterialTemplateGateway,
    private readonly classroomGateway: ClassroomGateway,
    private readonly studentGateway: StudentGateway,
    private readonly notificationGateway: NotificationGateway,
  ) {
    super();
  }

  async execute(input: AssignMaterialInput): Promise<AssignMaterialOutput> {
    // Verify material template exists
    const materialTemplate = await this.materialTemplateGateway.findById({ id: input.material_template_id });
    if (!materialTemplate) {
      throw new Error('Material template not found');
    }

    // Verify classroom exists
    const classroom = await this.classroomGateway.findById({ id: input.classroom_id });
    if (!classroom) {
      throw new Error('Classroom not found');
    }

    const assignmentId = uuidv4();
    
    const assignment = {
      id: assignmentId,
      material_template_id: input.material_template_id,
      classroom_id: input.classroom_id,
      assigned_by: input.assigned_by,
      expires_at: new Date(input.expires_at),
    };

    await this.materialAssignmentGateway.insert(assignment);

    const createdAssignment = await this.materialAssignmentGateway.findById({ id: assignmentId });
    if (!createdAssignment) {
      throw new Error('Failed to create material assignment');
    }

    // Create notifications for all students in the classroom
    try {
      const students = await this.studentGateway.findByClassroomId({ classroomId: input.classroom_id });
      
      if (students && students.length > 0) {
        await Promise.all(students.map(student => 
          this.notificationGateway.insert({
            id: uuidv4(),
            account_id: student.id,
            message: `Novo material atribuído: "${materialTemplate.name}" na turma ${classroom.name}`,
            url: `/student/materials`,
            creation_reason: 'MATERIAL_ASSIGNED',
            created_by: input.assigned_by,
            read_at: null,
          })
        ));
      }
    } catch (error) {
      console.error('Failed to create material assignment notifications:', error);
      // Don't fail the entire operation if notification fails
    }

    return {
      id: createdAssignment.id,
      material_template_id: createdAssignment.material_template_id,
      classroom_id: createdAssignment.classroom_id,
      assigned_by: createdAssignment.assigned_by,
      expires_at: createdAssignment.expires_at,
      created_at: createdAssignment.created_at,
    };
  }
}
