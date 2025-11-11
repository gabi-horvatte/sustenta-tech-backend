import UseCase from '@/modules/shared/base-use-case';
import { CompleteActivityInput, CompleteActivityOutput } from './dto';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import * as uuid from 'uuid';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';

export default class CompleteActivity extends UseCase<CompleteActivityInput, CompleteActivityOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly activityStudentGateway: ActivityStudentGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly classroomGateway: ClassroomGateway
  ) {
    super();
  }

  async execute(input: CompleteActivityInput): Promise<CompleteActivityOutput> {
    const activity = await this.activityGateway.findById({ id: input.activity_id });
    if (!activity)
      throw new Error('Activity not found');

    const classroom = await this.classroomGateway.findById({ id: activity.classroom_id });
    if (!classroom)
      throw new Error('Classroom not found');

    if (activity.expires_at < new Date())
      throw new Error('Activity expired');

    const now = new Date();

    const activityStudent = await this.activityStudentGateway.findById({ activity_id: input.activity_id, student_id: input.student_id });

    if (!activityStudent)
      await this.activityStudentGateway.update({ activity_id: input.activity_id, student_id: input.student_id, completed_at: now });
    else
      await this.activityStudentGateway.insert({ activity_id: input.activity_id, student_id: input.student_id, completed_at: now });

    await this.notificationGateway.insert({
      id: uuid.v4(),
      account_id: activity.teacher_id,
      message: `Atividade ${activity.name} completada por ${input.student_id}`,
      url: `/management/activities/activity/${input.activity_id}?name=${activity.name}&description=${activity.description}&classroom_name=${classroom.name}`,
      creation_reason: 'ACTIVITY_COMPLETED',
      created_by: input.student_id,
      read_at: null,
    });

    return {
      id: input.activity_id,
      student_id: input.student_id,
      completed_at: now,
    };
  }
}