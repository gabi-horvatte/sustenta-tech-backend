import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { ListAllTeacherActivitiesInput, ListAllTeacherActivitiesOutput } from './dto';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';

export default class ListAllTeacherActivities extends UseCase<ListAllTeacherActivitiesInput, ListAllTeacherActivitiesOutput> {
  constructor(private readonly activityGateway: ActivityGateway, private readonly accountGateway: AccountGateway) {
    super();
  }

  async execute(input: ListAllTeacherActivitiesInput): Promise<ListAllTeacherActivitiesOutput> {
    const activities = await this.activityGateway.findByTeacherId(input.teacher_id);

    return Promise.all(activities.map(async (activity) => {
      const teacher = await this.accountGateway.findById({ id: activity.teacher_id });
      if (!teacher) {
        throw new Error('Teacher not found');
      }

      return {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        activity_template_id: activity.activity_template_id,
        classroom_id: activity.classroom_id,
        teacher_id: activity.teacher_id,
        expires_at: activity.expires_at,
        created_at: activity.created_at,
        updated_at: activity.updated_at,
        teacher_name: `${teacher.name} ${teacher.last_name}`,
      }
    }));
  }
}