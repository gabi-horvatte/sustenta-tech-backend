import { Router } from "express";
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import MaterialGateway from '../../datasource/gateway';
import { asyncHandler } from '@/server/utils/async-handler';
import CompleteMaterialAssignment from '../../application/use-cases/CompleteMaterialAssignment';
import CompleteMaterialController from './complete-material';
import ListStudentMaterials from '../../application/use-cases/ListStudentMaterials';
import ListStudentMaterialsController from './list-materials';
import GetStudentMaterial from '../../application/use-cases/GetStudentMaterial';
import MaterialAssignmentGateway from '@/modules/MaterialTemplates/datasource/MaterialAssignment/gateway';
import MaterialCompletionGateway from '@/modules/MaterialTemplates/datasource/MaterialCompletion/gateway';

export const setupMaterialsRoutes = (router: Router) => {
  router.patch("/material/:id/complete", asyncHandler(async (req, res) => {
    const materialAssignmentGateway = new MaterialAssignmentGateway(req.dbClient);
    const materialCompletionGateway = new MaterialCompletionGateway(req.dbClient);
    const notificationGateway = new NotificationGateway(req.dbClient);
    await new CompleteMaterialController(new CompleteMaterialAssignment(materialAssignmentGateway, materialCompletionGateway, notificationGateway)).handle(req, res);
  }));

  router.get("/material", asyncHandler(async (req, res) => {
    const materialGateway = new MaterialGateway(req.dbClient);
    await new ListStudentMaterialsController(new ListStudentMaterials(materialGateway), new GetStudentMaterial(materialGateway)).handle(req, res);
  }));
};