import UseCase from '@/modules/shared/base-use-case';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import { DeleteActivityInput, DeleteActivityOutput } from './dto';

export default class DeleteActivity extends UseCase<DeleteActivityInput, DeleteActivityOutput> {
  constructor(private readonly activityGateway: ActivityGateway) {
    super();
  }

  async execute(input: DeleteActivityInput): Promise<DeleteActivityOutput> {
    const id = input.id;
    await this.activityGateway.delete({ id });

    return {
      id,
    };
  }
}