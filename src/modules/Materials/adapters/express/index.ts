import { Router } from "express";
import MaterialGateway from '../../datasource/gateway';
import { asyncHandler } from '@/express/utils/async-handler';
import CompleteMaterialAssignment from '../../application/use-cases/CompleteMaterialAssignment';
import CompleteMaterialController from './complete-material';
import ListStudentMaterials from '../../application/use-cases/ListStudentMaterials';
import ListStudentMaterialsController from './list-materials';
import GetStudentMaterial from '../../application/use-cases/GetStudentMaterial';

export const setupMaterialsRoutes = (router: Router) => {
  router.post("/material/complete", asyncHandler(async (req, res) => {
    const materialGateway = new MaterialGateway(req.dbClient);
    await new CompleteMaterialController(new CompleteMaterialAssignment(materialGateway)).handle(req, res);
  }));

  router.get("/material", asyncHandler(async (req, res) => {
    const materialGateway = new MaterialGateway(req.dbClient);
    await new ListStudentMaterialsController(new ListStudentMaterials(materialGateway), new GetStudentMaterial(materialGateway)).handle(req, res);
  }));
};