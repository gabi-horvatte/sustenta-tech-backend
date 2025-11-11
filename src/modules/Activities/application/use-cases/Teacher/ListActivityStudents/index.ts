import UseCase from '@/modules/shared/base-use-case';
import { ListActivityStudentsInput, ListActivityStudentsOutput } from './dto';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';

export default class ListActivityStudents extends UseCase<ListActivityStudentsInput, ListActivityStudentsOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly accountGateway: AccountGateway,
    private readonly studentGateway: StudentGateway,
  ) {
    super();
  }

  async execute(input: ListActivityStudentsInput): Promise<ListActivityStudentsOutput> {
    const activity = await this.activityGateway.findById({ id: input.activity_id });
    if (!activity) {
      throw new Error('Activity not found');
    }
    const students = await this.studentGateway.findByClassroomId({ classroomId: activity.classroom_id });
    const studentIds = students.map((student) => student.id);
    const studentAccounts = await this.accountGateway.findByIds(studentIds.map((studentId) => ({ id: studentId })));

    const activityStudents = await this.activityStudentGateway.findByActivityIds([input.activity_id]);

    return students.map((student) => {
      const studentAccount = studentAccounts.find((studentAccount) => studentAccount.id === student.id);
      if (!studentAccount) {
        throw new Error(`Student not found for activity student: ${student.id}`);
      }
      const activityStudent = activityStudents.find((activityStudent) => activityStudent.activity_id === input.activity_id && activityStudent.student_id === student.id);

      return {
        activity_id: input.activity_id,
        student_id: student.id,
        completed_at: activityStudent?.completed_at || null,
        student_name: `${studentAccount.name} ${studentAccount.last_name}`,
      };
    });
  }
}