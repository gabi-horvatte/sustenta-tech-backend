import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { EditActivityInput, EditActivityOutput } from './dto';
import { Activity } from '@/modules/Activities/datasource/Activity/model';
import * as uuid from 'uuid';

export default class EditActivity extends UseCase<EditActivityInput, EditActivityOutput> {
  constructor(private readonly activityGateway: ActivityGateway) {
    super();
  }

  async execute(input: EditActivityInput): Promise<EditActivityOutput> {
    const id = input.id || uuid.v4();

    const activity = await this.activityGateway.findById({ id });

    if (!activity) {
      throw new Error('Activity not found');
    }

    const updatedActivity: Omit<Activity, 'created_at' | 'updated_at'> = {
      id,
      name: input.name || activity.name,
      description: input.description || activity.description,
      activity_template_id: input.activity_template_id || activity.activity_template_id,
      classroom_id: input.classroom_id || activity.classroom_id,
      teacher_id: input.teacher_id || activity.teacher_id,
      expires_at: new Date(input.expires_at || activity.expires_at),
    };

    await this.activityGateway.update(updatedActivity);

    return {
      id,
      name: updatedActivity.name,
      description: updatedActivity.description,
      activity_template_id: updatedActivity.activity_template_id,
      classroom_id: updatedActivity.classroom_id,
      teacher_id: updatedActivity.teacher_id,
      expires_at: updatedActivity.expires_at,
    };
  }
}