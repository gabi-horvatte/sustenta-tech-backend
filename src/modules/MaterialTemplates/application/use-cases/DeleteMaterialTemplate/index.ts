import UseCase from '@/modules/shared/base-use-case';
import { DeleteMaterialTemplateInput, DeleteMaterialTemplateOutput } from './dto';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';

export default class DeleteMaterialTemplate extends UseCase<DeleteMaterialTemplateInput, DeleteMaterialTemplateOutput> {
  constructor(
    private readonly materialTemplateGateway: MaterialTemplateGateway
  ) {
    super();
  }

  async execute(input: DeleteMaterialTemplateInput): Promise<DeleteMaterialTemplateOutput> {
    const existingTemplate = await this.materialTemplateGateway.findById({ id: input.id });
    if (!existingTemplate) {
      throw new Error('Material template not found');
    }

    await this.materialTemplateGateway.delete({ id: input.id });

    return {
      id: input.id,
    };
  }
}

