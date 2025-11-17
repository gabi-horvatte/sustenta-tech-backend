import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { ListActivitiesInput, ListActivitiesOutput } from './dto';
import { Activity } from '@/modules/Activities/datasource/Activity/model';
import * as uuid from 'uuid';

export default class ListActivities extends UseCase<ListActivitiesInput, ListActivitiesOutput> {
  constructor(private readonly activityGateway: ActivityGateway) {
    super();
  }

  async execute(input: ListActivitiesInput): Promise<ListActivitiesOutput> {
    const activities = await this.activityGateway.findByClassroomId({ classroomId: input.classroom_id });

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