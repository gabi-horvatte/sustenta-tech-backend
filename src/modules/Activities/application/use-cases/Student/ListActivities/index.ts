import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { ListActivitiesInput, ListActivitiesOutput } from './dto';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';

export default class ListActivities extends UseCase<ListActivitiesInput, ListActivitiesOutput> {
  constructor(
    private readonly studentGateway: StudentGateway,
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
  ) {
    super();
  }

  async execute(input: ListActivitiesInput): Promise<ListActivitiesOutput> {
    const student = await this.studentGateway.findById({ id: input.student_id });
    if (!student)
      throw new Error('Student not found');

    const activities = await this.activityGateway.findByClassroomId({ classroomId: student.classroom_id });
    const activityStudents = await this.activityStudentGateway.findByActivityIds(activities.map((activity) => activity.id));

    return activities.map((activity) => {
      return {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        url: activity.url,
        classroom_id: activity.classroom_id,
        teacher_id: activity.teacher_id,
        expires_at: activity.expires_at,
        completed_at: activityStudents.find((activityStudent) => activityStudent.activity_id === activity.id)?.completed_at || null,
      };
    });
  }
}