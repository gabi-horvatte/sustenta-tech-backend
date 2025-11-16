import { Router } from "express";
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import MaterialGateway from '../../datasource/gateway';
import { asyncHandler } from '@/express/utils/async-handler';
import CompleteMaterialAssignment from '../../application/use-cases/CompleteMaterialAssignment';
import CompleteMaterialController from './complete-material';
import ListStudentMaterials from '../../application/use-cases/ListStudentMaterials';
import ListStudentMaterialsController from './list-materials';
import GetStudentMaterial from '../../application/use-cases/GetStudentMaterial';

export const setupMaterialsRoutes = (router: Router) => {
  router.patch("/material/:id/complete", asyncHandler(async (req, res) => {
    const materialGateway = new MaterialGateway(req.dbClient);
    const notificationGateway = new NotificationGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    await new CompleteMaterialController(new CompleteMaterialAssignment(materialGateway, notificationGateway, accountGateway)).handle(req, res);
  }));

  router.get("/material", asyncHandler(async (req, res) => {
    const materialGateway = new MaterialGateway(req.dbClient);
    await new ListStudentMaterialsController(new ListStudentMaterials(materialGateway), new GetStudentMaterial(materialGateway)).handle(req, res);
  }));
};