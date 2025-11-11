import MaterialGateway from '@/modules/Materials/datasource/gateway.js';
import { CompleteMaterialAssignmentInput, CompleteMaterialAssignmentOutput } from './dto.js';
import UseCase from '@/modules/shared/base-use-case.js';
import { Material } from '@/modules/Materials/datasource/model.js';

export default class CompleteMaterialAssignment extends UseCase<CompleteMaterialAssignmentInput, CompleteMaterialAssignmentOutput> {
  constructor(private readonly materialGateway: MaterialGateway) { super(); }

  async execute(input: CompleteMaterialAssignmentInput): Promise<CompleteMaterialAssignmentOutput> {
    const existingMaterial = await this.materialGateway.findById({ id: input.id, student_id: input.student_id });

    if (existingMaterial)
      return {
        id: existingMaterial.id,
        student_id: existingMaterial.student_id,
        completed_at: existingMaterial.created_at,
      };

    const material: Omit<Material, 'created_at' | 'updated_at'> = {
      id: input.id,
      student_id: input.student_id,
    };

    await this.materialGateway.insert(material);

    return {
      id: material.id,
      student_id: material.student_id,
      completed_at: new Date(),
    };
  }
}