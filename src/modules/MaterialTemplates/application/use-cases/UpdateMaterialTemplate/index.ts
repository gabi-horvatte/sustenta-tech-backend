import UseCase from '@/modules/shared/base-use-case';
import { UpdateMaterialTemplateInput, UpdateMaterialTemplateOutput } from './dto';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';

export default class UpdateMaterialTemplate extends UseCase<UpdateMaterialTemplateInput, UpdateMaterialTemplateOutput> {
  constructor(
    private readonly materialTemplateGateway: MaterialTemplateGateway,
  ) {
    super();
  }

  async execute(input: UpdateMaterialTemplateInput): Promise<UpdateMaterialTemplateOutput> {
    // First check if the template exists
    const existingTemplate = await this.materialTemplateGateway.findById({ id: input.id });
    if (!existingTemplate) {
      throw new Error('Material template not found');
    }

    const materialTemplate = {
      id: input.id,
      name: input.name,
      description: input.description,
      authors: input.authors,
      url: input.url,
      thumbnail: input.thumbnail || null,
      material_type: input.material_type,
      created_by: existingTemplate.created_by, // Keep the original creator
    };

    await this.materialTemplateGateway.update(materialTemplate);

    const updatedTemplate = await this.materialTemplateGateway.findById({ id: input.id });
    if (!updatedTemplate) {
      throw new Error('Failed to update material template');
    }

    return {
      id: updatedTemplate.id,
      name: updatedTemplate.name,
      description: updatedTemplate.description,
      authors: updatedTemplate.authors,
      url: updatedTemplate.url,
      thumbnail: updatedTemplate.thumbnail,
      material_type: updatedTemplate.material_type,
      created_by: updatedTemplate.created_by,
      created_at: updatedTemplate.created_at,
      updated_at: updatedTemplate.updated_at,
    };
  }
}



