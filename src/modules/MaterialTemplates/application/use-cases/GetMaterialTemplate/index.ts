import UseCase from '@/modules/shared/base-use-case';
import { GetMaterialTemplateInput, GetMaterialTemplateOutput } from './dto';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';

export default class GetMaterialTemplate extends UseCase<GetMaterialTemplateInput, GetMaterialTemplateOutput> {
  constructor(
    private readonly materialTemplateGateway: MaterialTemplateGateway,
  ) {
    super();
  }

  async execute(input: GetMaterialTemplateInput): Promise<GetMaterialTemplateOutput> {
    const template = await this.materialTemplateGateway.findById({ id: input.id });

    if (!template) {
      throw new Error('Material template not found');
    }

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      authors: template.authors,
      url: template.url,
      thumbnail: template.thumbnail,
      material_type: template.material_type,
      created_by: template.created_by,
      created_at: template.created_at,
      updated_at: template.updated_at,
    };
  }
}

