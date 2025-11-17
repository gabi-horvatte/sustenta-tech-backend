import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { GetActivityInput, GetActivityOutput } from './dto';

export default class GetActivity extends UseCase<GetActivityInput, GetActivityOutput> {
  constructor(private readonly activityGateway: ActivityGateway) {
    super();
  }

  async execute(input: GetActivityInput): Promise<GetActivityOutput> {
    const activity = await this.activityGateway.findById({ id: input.id });

    if (!activity) return null;

    return {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      activity_template_id: activity.activity_template_id,
      classroom_id: activity.classroom_id,
      teacher_id: activity.teacher_id,
      expires_at: activity.expires_at,
    };
  }
}