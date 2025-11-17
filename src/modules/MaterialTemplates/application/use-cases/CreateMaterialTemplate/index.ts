import UseCase from '@/modules/shared/base-use-case';
import { CreateMaterialTemplateInput, CreateMaterialTemplateOutput } from './dto';
import MaterialTemplateGateway from '../../../datasource/MaterialTemplate/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import { v4 as uuidv4 } from 'uuid';

export default class CreateMaterialTemplate extends UseCase<CreateMaterialTemplateInput, CreateMaterialTemplateOutput> {
  constructor(
    private readonly materialTemplateGateway: MaterialTemplateGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: CreateMaterialTemplateInput): Promise<CreateMaterialTemplateOutput> {
    const materialTemplateId = uuidv4();
    
    const materialTemplate = {
      id: materialTemplateId,
      name: input.name,
      description: input.description,
      authors: input.authors,
      url: input.url,
      thumbnail: input.thumbnail || null,
      material_type: input.material_type,
      created_by: input.created_by,
    };

    await this.materialTemplateGateway.insert(materialTemplate);

    const createdTemplate = await this.materialTemplateGateway.findById({ id: materialTemplateId });
    if (!createdTemplate) {
      throw new Error('Failed to create material template');
    }

    // Create notifications for all other teachers
    try {
      const creator = await this.accountGateway.findById({ id: input.created_by });
      const allTeachers = await this.accountGateway.findByRole('TEACHER');
      
      if (creator && allTeachers) {
        const otherTeachers = allTeachers.filter(teacher => teacher.id !== input.created_by);
        
        await Promise.all(otherTeachers.map(teacher => 
          this.notificationGateway.insert({
            id: uuidv4(),
            account_id: teacher.id,
            message: `${creator.name} ${creator.last_name} criou um novo modelo de material: "${input.name}"`,
            url: `/management/materials`,
            creation_reason: 'MATERIAL_TEMPLATE_CREATED',
            created_by: input.created_by,
            read_at: null,
          })
        ));
      }
    } catch (error) {
      console.error('Failed to create material template notifications:', error);
      // Don't fail the entire operation if notification fails
    }

    return {
      id: createdTemplate.id,
      name: createdTemplate.name,
      description: createdTemplate.description,
      authors: createdTemplate.authors,
      url: createdTemplate.url,
      thumbnail: createdTemplate.thumbnail,
      material_type: createdTemplate.material_type,
      created_by: createdTemplate.created_by,
      created_at: createdTemplate.created_at,
    };
  }
}
