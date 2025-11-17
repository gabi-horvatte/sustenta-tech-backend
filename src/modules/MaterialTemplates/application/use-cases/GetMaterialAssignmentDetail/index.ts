import UseCase from '@/modules/shared/base-use-case';
import { GetMaterialAssignmentDetailInput, GetMaterialAssignmentDetailOutput } from './dto';
import MaterialAssignmentGateway from '../../../datasource/MaterialAssignment/gateway';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';
import MaterialCompletionGateway from '../../../datasource/MaterialCompletion/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';

export default class GetMaterialAssignmentDetail extends UseCase<GetMaterialAssignmentDetailInput, GetMaterialAssignmentDetailOutput> {
  constructor(
    private readonly materialAssignmentGateway: MaterialAssignmentGateway,
    private readonly materialTemplateGateway: MaterialTemplateGateway,
    private readonly materialCompletionGateway: MaterialCompletionGateway,
    private readonly classroomGateway: ClassroomGateway,
    private readonly studentGateway: StudentGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: GetMaterialAssignmentDetailInput): Promise<GetMaterialAssignmentDetailOutput> {
    // Get the material assignment
    const assignment = await this.materialAssignmentGateway.findById({ id: input.assignment_id });
    if (!assignment) {
      return null;
    }

    // Get the material template
    const template = await this.materialTemplateGateway.findById({ id: assignment.material_template_id });
    if (!template) {
      return null;
    }

    // Get the classroom
    const classroom = await this.classroomGateway.findById({ id: assignment.classroom_id });
    if (!classroom) {
      return null;
    }

    // Get all students in the classroom
    const students = await this.studentGateway.findByClassroomId({ classroomId: assignment.classroom_id });
    
    // Get account data for students to get names
    const accounts = await this.accountGateway.findByIds(students.map(student => ({ id: student.id })));

    // Get all completions for this assignment
    const completions = await this.materialCompletionGateway.findByMaterialAssignmentId(input.assignment_id);

    // Build the result with student completion data
    const studentsWithCompletion = students.map(student => {
      const account = accounts.find(acc => acc.id === student.id);
      const completion = completions.find(c => c.student_id === student.id);
      
      if (!account) {
        throw new Error(`Account not found for student: ${student.id}`);
      }
      
      return {
        id: student.id,
        name: account.name,
        last_name: account.last_name,
        completed_at: completion?.completed_at || null,
      };
    });

    return {
      id: assignment.id,
      name: template.name,
      description: template.description,
      authors: template.authors,
      url: template.url,
      material_type: template.material_type,
      expires_at: assignment.expires_at,
      created_at: assignment.created_at,
      classroom_name: classroom.name,
      students: studentsWithCompletion,
    };
  }
}
