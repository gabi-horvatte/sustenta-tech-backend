import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { CreateActivityInput, CreateActivityOutput } from './dto';
import { Activity } from '@/modules/Activities/datasource/Activity/model';
import * as uuid from 'uuid';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';

export default class CreateActivity extends UseCase<CreateActivityInput, CreateActivityOutput> {
  constructor(
    private readonly activityGateway: ActivityGateway,
    private readonly studentGateway: StudentGateway,
    private readonly notificationGateway: NotificationGateway
  ) {
    super();
  }

  async execute(input: CreateActivityInput): Promise<CreateActivityOutput> {
    const id = input.id || uuid.v4();

    const activity: Omit<Activity, 'created_at' | 'updated_at'> = {
      id,
      name: input.name,
      description: input.description,
      url: input.url,
      classroom_id: input.classroom_id,
      teacher_id: input.teacher_id,
      expires_at: new Date(input.expires_at),
    };

    await this.activityGateway.insert(activity);

    await this.notificationGateway.insert({
      id,
      account_id: input.teacher_id,
      message: `Atividade ${input.name} criada`,
      url: `/management/activities`,
      creation_reason: 'ACTIVITY_CREATED',
      created_by: input.teacher_id,
      read_at: null,
    });

    const students = await this.studentGateway.findByClassroomId({ classroomId: input.classroom_id });

    await Promise.all(students.map((student) =>
      this.notificationGateway.insert({
        id: uuid.v4(),
        account_id: student.id,
        message: `Atividade ${input.name} criada`,
        url: `/students/activities`,
        creation_reason: 'ACTIVITY_CREATED',
        created_by: input.teacher_id,
        read_at: null,
      })
    ));

    return {
      id,
      name: input.name,
      description: input.description,
      url: input.url,
      classroom_id: input.classroom_id,
      teacher_id: input.teacher_id,
      expires_at: new Date(input.expires_at),
    };
  }
}