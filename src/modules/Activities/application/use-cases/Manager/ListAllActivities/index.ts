import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { ListAllActivitiesOutput } from './dto';

export default class ListAllActivities extends UseCase<void, ListAllActivitiesOutput> {
  constructor(private readonly activityGateway: ActivityGateway) {
    super();
  }

  async execute(): Promise<ListAllActivitiesOutput> {
    const activities = await this.activityGateway.findAll();

    return activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      activity_template_id: activity.activity_template_id,
      classroom_id: activity.classroom_id,
      teacher_id: activity.teacher_id,
      expires_at: activity.expires_at,
      created_at: activity.created_at,
      updated_at: activity.updated_at,
    }));
  }
}