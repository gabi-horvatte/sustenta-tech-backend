import MaterialGateway from '@/modules/Materials/datasource/gateway.js';
import { GetStudentMaterialInput, GetStudentMaterialOutput } from './dto.js';
import UseCase from '@/modules/shared/base-use-case.js';

export default class GetStudentMaterial extends UseCase<GetStudentMaterialInput, GetStudentMaterialOutput> {
  constructor(private readonly materialGateway: MaterialGateway) { super(); }

  async execute(input: GetStudentMaterialInput): Promise<GetStudentMaterialOutput> {
    const material = await this.materialGateway.findByStudentIdAndType({ student_id: input.student_id, type: input.type });

    return material;
  }
}