import UseCase from '@/modules/shared/base-use-case';
import { CompleteMaterialInput, CompleteMaterialOutput } from './dto';
import MaterialCompletionGateway from '../../../datasource/MaterialCompletion/gateway';
import MaterialAssignmentGateway from '../../../datasource/MaterialAssignment/gateway';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';
import { v4 as uuidv4 } from 'uuid';

export default class CompleteMaterial extends UseCase<CompleteMaterialInput, CompleteMaterialOutput> {
  constructor(
    private readonly materialCompletionGateway: MaterialCompletionGateway,
    private readonly materialAssignmentGateway: MaterialAssignmentGateway,
    private readonly materialTemplateGateway: MaterialTemplateGateway,
    private readonly studentGateway: StudentGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly accountGateway: AccountGateway,
    private readonly classroomGateway: ClassroomGateway,
  ) {
    super();
  }

  async execute(input: CompleteMaterialInput): Promise<CompleteMaterialOutput> {
    // Verify material assignment exists
    const materialAssignment = await this.materialAssignmentGateway.findById({ id: input.material_assignment_id });
    if (!materialAssignment) {
      throw new Error('Material assignment not found');
    }

    // Verify student exists
    const student = await this.studentGateway.findById({ id: input.student_id });
    if (!student) {
      throw new Error('Student not found');
    }

    // Check if already completed
    const existingCompletion = await this.materialCompletionGateway.findByMaterialAssignmentAndStudent(
      input.material_assignment_id, 
      input.student_id
    );

    if (existingCompletion) {
      return {
        id: existingCompletion.id,
        material_assignment_id: existingCompletion.material_assignment_id,
        student_id: existingCompletion.student_id,
        completed_at: existingCompletion.completed_at,
      };
    }

    const completionId = uuidv4();
    const completedAt = new Date();
    
    const completion = {
      id: completionId,
      material_assignment_id: input.material_assignment_id,
      student_id: input.student_id,
      completed_at: completedAt,
    };

    await this.materialCompletionGateway.insert(completion);

    // Create notification for teacher
    try {
      const materialTemplate = await this.materialTemplateGateway.findById({ id: materialAssignment.material_template_id });
      const studentAccount = await this.accountGateway.findById({ id: input.student_id });
      const classroom = await this.classroomGateway.findById({ id: materialAssignment.classroom_id });
      
      if (materialTemplate && studentAccount && classroom) {
        await this.notificationGateway.insert({
          id: uuidv4(),
          account_id: materialAssignment.assigned_by,
          message: `${studentAccount.name} ${studentAccount.last_name} concluiu o material "${materialTemplate.name}"`,
          url: `/management/materials/assignment/${input.material_assignment_id}?name=${encodeURIComponent(materialTemplate.name)}&classroom=${encodeURIComponent(classroom.name)}`,
          creation_reason: 'MATERIAL_COMPLETED',
          created_by: input.student_id,
          read_at: null,
        });
      }
    } catch (error) {
      console.error('Failed to create material completion notification:', error);
      // Don't fail the entire operation if notification fails
    }

    return {
      id: completionId,
      material_assignment_id: input.material_assignment_id,
      student_id: input.student_id,
      completed_at: completedAt,
    };
  }
}
