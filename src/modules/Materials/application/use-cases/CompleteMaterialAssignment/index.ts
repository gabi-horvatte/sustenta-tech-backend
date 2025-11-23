import { CompleteMaterialAssignmentInput, CompleteMaterialAssignmentOutput } from './dto.js';
import UseCase from '@/modules/shared/base-use-case.js';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway.js';
import * as uuid from 'uuid';
import MaterialAssignmentGateway from '@/modules/MaterialTemplates/datasource/MaterialAssignment/gateway.js';
import MaterialCompletionGateway from '@/modules/MaterialTemplates/datasource/MaterialCompletion/gateway.js';
import { MaterialCompletion } from '@/modules/MaterialTemplates/datasource/MaterialCompletion/model.js';

export default class CompleteMaterialAssignment extends UseCase<CompleteMaterialAssignmentInput, CompleteMaterialAssignmentOutput> {
  constructor(
    private readonly materialAssignmentGateway: MaterialAssignmentGateway,
    private readonly materialCompletionGateway: MaterialCompletionGateway,
    private readonly notificationGateway: NotificationGateway,
  ) { super(); }

  async execute(input: CompleteMaterialAssignmentInput): Promise<CompleteMaterialAssignmentOutput> {

    const materialAssignment = await this.materialAssignmentGateway.findById({ id: input.id });
    if (!materialAssignment)
      throw new Error('Material assignment not found');

    const existingMaterialCompletion = await this.materialCompletionGateway.findByMaterialAssignmentAndStudent(input.id, input.student_id);

    if (existingMaterialCompletion)
      return {
        id: existingMaterialCompletion.id,
        student_id: existingMaterialCompletion.student_id,
        completed_at: existingMaterialCompletion.created_at,
      };

    const materialCompletion: Omit<MaterialCompletion, 'created_at' | 'updated_at' | 'deleted_at'> = {
      id: uuid.v4(),
      material_assignment_id: materialAssignment.id,
      student_id: input.student_id,
      completed_at: new Date(),
    };

    await this.materialCompletionGateway.insert(materialCompletion);
    await this.notificationGateway.insert({
      id: uuid.v4(),
      account_id: materialAssignment.assigned_by,
      message: `Material ${materialAssignment.material_template_id} concluído por ${input.student_id}`,
      url: `/management/materials/`,
      creation_reason: 'MATERIAL_COMPLETED',
      created_by: input.student_id,
      read_at: null,
    });

    return {
      id: materialCompletion.id,
      student_id: materialCompletion.student_id,
      completed_at: materialCompletion.completed_at,
    };
  }
}