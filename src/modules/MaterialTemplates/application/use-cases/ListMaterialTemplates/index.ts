import UseCase from '@/modules/shared/base-use-case';
import { ListMaterialTemplatesInput, ListMaterialTemplatesOutput } from './dto';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';

export default class ListMaterialTemplates extends UseCase<ListMaterialTemplatesInput, ListMaterialTemplatesOutput> {
  constructor(
    private readonly materialTemplateGateway: MaterialTemplateGateway,
  ) {
    super();
  }

  async execute(input: ListMaterialTemplatesInput): Promise<ListMaterialTemplatesOutput> {
    const templates = input.created_by 
      ? await this.materialTemplateGateway.findByCreatedBy(input.created_by)
      : await this.materialTemplateGateway.findAll();

    return templates.map((template: any) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      authors: template.authors,
      url: template.url,
      thumbnail: template.thumbnail,
      material_type: template.material_type,
      created_by: template.created_by,
      created_at: template.created_at,
    }));
  }
}
