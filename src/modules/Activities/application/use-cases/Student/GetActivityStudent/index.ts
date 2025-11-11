import UseCase from '@/modules/shared/base-use-case';
import { GetActivityStudentInput, GetActivityStudentOutput } from './dto';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';

export default class GetActivityStudent extends UseCase<GetActivityStudentInput, GetActivityStudentOutput> {
  constructor(private readonly activityStudentGateway: ActivityStudentGateway) {
    super();
  }

  async execute(input: GetActivityStudentInput): Promise<GetActivityStudentOutput> {
    const activityStudent = await this.activityStudentGateway.findById({ activity_id: input.activity_id, student_id: input.student_id });

    return activityStudent;
  }
}