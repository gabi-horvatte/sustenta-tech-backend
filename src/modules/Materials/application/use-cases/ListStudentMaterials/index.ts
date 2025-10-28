import MaterialGateway from '@/modules/Materials/datasource/gateway.js';
import { ListStudentMaterialsInput, ListStudentMaterialsOutput } from './dto.js';
import UseCase from '@/modules/shared/base-use-case.js';

export default class ListStudentMaterials extends UseCase<ListStudentMaterialsInput, ListStudentMaterialsOutput> {
  constructor(private readonly materialGateway: MaterialGateway) { super(); }

  async execute(input: ListStudentMaterialsInput): Promise<ListStudentMaterialsOutput> {
    const materials = await this.materialGateway.findByStudentId({ student_id: input.student_id });

    return materials;
  }
}