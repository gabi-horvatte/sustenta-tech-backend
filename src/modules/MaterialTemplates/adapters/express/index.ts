import { Router } from "express";
import { asyncHandler } from '@/server/utils/async-handler';

// Gateways
import MaterialTemplateGateway from '../../datasource/MaterialTemplate/gateway';
import MaterialAssignmentGateway from '../../datasource/MaterialAssignment/gateway';
import MaterialCompletionGateway from '../../datasource/MaterialCompletion/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';

// Use Cases
import CreateMaterialTemplate from '../../application/use-cases/CreateMaterialTemplate';
import ListMaterialTemplates from '../../application/use-cases/ListMaterialTemplates';
import AssignMaterial from '../../application/use-cases/AssignMaterial';
import CompleteMaterial from '../../application/use-cases/CompleteMaterial';
import ListStudentMaterials from '../../application/use-cases/ListStudentMaterials';

// Controllers
import CreateMaterialTemplateController from './create-material-template';
import ListMaterialTemplatesController from './list-material-templates';
import AssignMaterialController from './assign-material';
import CompleteMaterialController from './complete-material';
import ListStudentMaterialsController from './list-student-materials';
import ListMaterialAssignments from '../../application/use-cases/ListMaterialAssignments';
import ListMaterialAssignmentsController from './list-material-assignments';
import GetMaterialAssignmentDetail from '../../application/use-cases/GetMaterialAssignmentDetail';
import GetMaterialAssignmentDetailController from './get-material-assignment-detail';

export const setupMaterialTemplatesRoutes = (router: Router) => {
  // Create material template
  router.post("/material-template", asyncHandler(async (req, res) => {
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    
    const notificationGateway = new NotificationGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    
    await new CreateMaterialTemplateController(
      new CreateMaterialTemplate(materialTemplateGateway, notificationGateway, accountGateway)
    ).handle(req, res);
  }));

  // List material templates
  router.get("/material-template", asyncHandler(async (req, res) => {
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    
    await new ListMaterialTemplatesController(
      new ListMaterialTemplates(materialTemplateGateway)
    ).handle(req, res);
  }));

  // Assign material to classroom
  router.post("/material-assignment", asyncHandler(async (req, res) => {
    const materialAssignmentGateway = new MaterialAssignmentGateway(req.dbClient);
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    const classroomGateway = new ClassroomGateway(req.dbClient);
    
    const studentGateway = new StudentGateway(req.dbClient);
    const notificationGateway = new NotificationGateway(req.dbClient);
    
    await new AssignMaterialController(
      new AssignMaterial(materialAssignmentGateway, materialTemplateGateway, classroomGateway, studentGateway, notificationGateway)
    ).handle(req, res);
  }));

  // Complete material assignment
  router.patch("/material-assignment/:assignment_id/complete", asyncHandler(async (req, res) => {
    const materialCompletionGateway = new MaterialCompletionGateway(req.dbClient);
    const materialAssignmentGateway = new MaterialAssignmentGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    const notificationGateway = new NotificationGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    const classroomGateway = new ClassroomGateway(req.dbClient);
    
    await new CompleteMaterialController(
      new CompleteMaterial(materialCompletionGateway, materialAssignmentGateway, materialTemplateGateway, studentGateway, notificationGateway, accountGateway, classroomGateway)
    ).handle(req, res);
  }));

  // List student materials
  router.get("/student-materials", asyncHandler(async (req, res) => {
    const materialAssignmentGateway = new MaterialAssignmentGateway(req.dbClient);
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    const materialCompletionGateway = new MaterialCompletionGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    
    await new ListStudentMaterialsController(
      new ListStudentMaterials(materialAssignmentGateway, materialTemplateGateway, materialCompletionGateway, studentGateway)
    ).handle(req, res);
  }));

  // List material assignments
  router.get("/material-assignment", asyncHandler(async (req, res) => {
    const materialAssignmentGateway = new MaterialAssignmentGateway(req.dbClient);
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    const classroomGateway = new ClassroomGateway(req.dbClient);
    
    await new ListMaterialAssignmentsController(
      new ListMaterialAssignments(materialAssignmentGateway, materialTemplateGateway, classroomGateway)
    ).handle(req, res);
  }));

  // Get material assignment detail
  router.get("/material-assignment/:assignment_id/detail", asyncHandler(async (req, res) => {
    const materialAssignmentGateway = new MaterialAssignmentGateway(req.dbClient);
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    const materialCompletionGateway = new MaterialCompletionGateway(req.dbClient);
    const classroomGateway = new ClassroomGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    
    await new GetMaterialAssignmentDetailController(
      new GetMaterialAssignmentDetail(
        materialAssignmentGateway, 
        materialTemplateGateway, 
        materialCompletionGateway, 
        classroomGateway, 
        studentGateway,
        accountGateway
      )
    ).handle(req, res);
  }));
};
