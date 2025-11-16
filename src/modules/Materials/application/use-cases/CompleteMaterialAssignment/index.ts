import MaterialGateway from '@/modules/Materials/datasource/gateway.js';
import { CompleteMaterialAssignmentInput, CompleteMaterialAssignmentOutput } from './dto.js';
import UseCase from '@/modules/shared/base-use-case.js';
import { Material } from '@/modules/Materials/datasource/model.js';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway.js';
import * as uuid from 'uuid';
import { materialsContent } from '@/modules/Materials/datasource/content.js';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway.js';

export default class CompleteMaterialAssignment extends UseCase<CompleteMaterialAssignmentInput, CompleteMaterialAssignmentOutput> {
  constructor(
    private readonly materialGateway: MaterialGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly accountGateway: AccountGateway
  ) { super(); }

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

    const materialContent = materialsContent.find((content) => content.id === input.id);
    if (!materialContent)
      throw new Error('Material not found');

    const student = await this.accountGateway.findById({ id: input.student_id });
    if (!student || student.role !== 'STUDENT')
      throw new Error('Student not found');

    await this.materialGateway.insert(material);
    await this.notificationGateway.insert({
      id: uuid.v4(),
      account_id: material.student_id,
      message: `Material ${materialContent.title} concluído por ${student.name} ${student.last_name}`,
      url: '/management/materials',
      creation_reason: 'MATERIAL_COMPLETED',
      created_by: material.student_id,
      read_at: null,
    });

    return {
      id: material.id,
      student_id: material.student_id,
      completed_at: new Date(),
    };
  }
}