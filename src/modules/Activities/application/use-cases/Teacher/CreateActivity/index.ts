import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { CreateActivityInput, CreateActivityOutput } from './dto';
import { Activity } from '@/modules/Activities/datasource/Activity/model';
import * as uuid from 'uuid';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';

export default class CreateActivity extends UseCase<CreateActivityInput, CreateActivityOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly studentGateway: StudentGateway,
    private readonly classroomGateway: ClassroomGateway,
    private readonly notificationGateway: NotificationGateway
  ) {
    super();
  }

  async execute(input: CreateActivityInput): Promise<CreateActivityOutput> {
    const id = input.id || uuid.v4();

    const classroom = await this.classroomGateway.findById({ id: input.classroom_id });
    if (!classroom)
      throw new Error('Classroom not found');

    const activity: Omit<Activity, 'created_at' | 'updated_at'> = {
      id,
      name: input.name,
      description: input.description,
      classroom_id: input.classroom_id,
      teacher_id: input.teacher_id,
      expires_at: new Date(input.expires_at),
      activity_template_id: input.activity_template_id,
    };

    const students = await this.studentGateway.findByClassroomId({ classroomId: input.classroom_id });

    await Promise.all([
      this.activityGateway.insert(activity),
      this.notificationGateway.insert({
        id,
        account_id: input.teacher_id,
        message: `Atividade ${input.name} criada`,
        url: `/management/activities/activity/${id}?name=${input.name}&description=${input.description}&classroom_name=${classroom.name}`,
        creation_reason: 'ACTIVITY_CREATED',
        created_by: input.teacher_id,
        read_at: null,
      }),
      ...students.map((student) =>
        this.notificationGateway.insert({
          id: uuid.v4(),
          account_id: student.id,
          message: `Atividade ${input.name} criada`,
          url: `/student/activities`,
          creation_reason: 'ACTIVITY_CREATED',
          created_by: input.teacher_id,
          read_at: null,
        })
      )]);

    return {
      id,
      name: input.name,
      description: input.description,
      activity_template_id: input.activity_template_id,
      classroom_id: input.classroom_id,
      teacher_id: input.teacher_id,
      expires_at: new Date(input.expires_at),
    };
  }
}