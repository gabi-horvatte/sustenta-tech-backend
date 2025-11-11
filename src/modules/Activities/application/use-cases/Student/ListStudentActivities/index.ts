import UseCase from '@/modules/shared/base-use-case';
import { ListStudentActivitiesInput, ListStudentActivitiesOutput } from './dto';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';

export default class ListStudentActivities extends UseCase<ListStudentActivitiesInput, ListStudentActivitiesOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly studentGateway: StudentGateway,
  ) {
    super();
  }

  async execute(input: ListStudentActivitiesInput): Promise<ListStudentActivitiesOutput> {
    const student = await this.studentGateway.findById({ id: input.student_id });
    if (!student)
      throw new Error('Student not found');

    const activities = await this.activityGateway.findByClassroomId({ classroomId: student.classroom_id });
    const activityStudents = await this.activityStudentGateway.findByActivityIds(activities.map((activity) => activity.id));

    return activities.map((activity) => {
      return {
        id: activity.id,
        activity_id: activity.id,
        student_id: input.student_id,
        completed_at: activityStudents.find((activityStudent) => activityStudent.activity_id === activity.id)?.completed_at || null,
        activity_name: activity.name,
        expires_at: activity.expires_at,
        description: activity.description,
        url: activity.url,
      };
    });
  }
}