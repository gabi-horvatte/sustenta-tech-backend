import express, { Router } from "express";
import { asyncHandler } from '@/server/utils/async-handler';

// Gateways
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import StudentAnswerGateway from '@/modules/ActivityTemplates/datasource/StudentAnswer/gateway';
import QuestionGateway from '@/modules/ActivityTemplates/datasource/Question/gateway';
import ActivityTemplateGateway from '@/modules/ActivityTemplates/datasource/ActivityTemplate/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import MaterialTemplateGateway from '@/modules/MaterialTemplates/datasource/MaterialTemplate/gateway';
import MaterialAssignmentGateway from '@/modules/MaterialTemplates/datasource/MaterialAssignment/gateway';
import MaterialCompletionGateway from '@/modules/MaterialTemplates/datasource/MaterialCompletion/gateway';

// Use Cases
import GetActivityReports from '../../application/use-cases/GetActivityReports';
import GetMaterialReports from '../../application/use-cases/GetMaterialReports';
import GetClassroomReports from '../../application/use-cases/GetClassroomReports';

// Controllers
import GetActivityReportsController from './get-activity-reports';
import GetMaterialReportsController from './get-material-reports';
import GetClassroomReportsController from './get-classroom-reports';

export const setupAnalyticsRoutes = (app: express.Express) => {
  const router = Router();
  // Get activity reports
  router.get("/activity-reports", asyncHandler(async (req, res) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    const activityStudentGateway = new ActivityStudentGateway(req.dbClient);
    const studentAnswerGateway = new StudentAnswerGateway(req.dbClient);
    const questionGateway = new QuestionGateway(req.dbClient);
    const activityTemplateGateway = new ActivityTemplateGateway(req.dbClient);
    const classroomGateway = new ClassroomGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    
    await new GetActivityReportsController(
      new GetActivityReports(
        activityGateway,
        activityStudentGateway,
        studentAnswerGateway,
        questionGateway,
        activityTemplateGateway,
        classroomGateway,
        studentGateway,
        accountGateway
      )
    ).handle(req, res);
  }));

  // Get material reports
  router.get("/material-reports", asyncHandler(async (req, res) => {
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    const materialAssignmentGateway = new MaterialAssignmentGateway(req.dbClient);
    const materialCompletionGateway = new MaterialCompletionGateway(req.dbClient);
    const classroomGateway = new ClassroomGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    
    await new GetMaterialReportsController(
      new GetMaterialReports(
        materialTemplateGateway,
        materialAssignmentGateway,
        materialCompletionGateway,
        classroomGateway,
        studentGateway,
        accountGateway
      )
    ).handle(req, res);
  }));

  // Get classroom reports
  router.get("/classroom-reports", asyncHandler(async (req, res) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    const activityStudentGateway = new ActivityStudentGateway(req.dbClient);
    const studentAnswerGateway = new StudentAnswerGateway(req.dbClient);
    const materialAssignmentGateway = new MaterialAssignmentGateway(req.dbClient);
    const materialCompletionGateway = new MaterialCompletionGateway(req.dbClient);
    const materialTemplateGateway = new MaterialTemplateGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    
    await new GetClassroomReportsController(
      new GetClassroomReports(
        activityGateway,
        activityStudentGateway,
        studentAnswerGateway,
        materialAssignmentGateway,
        materialCompletionGateway,
        materialTemplateGateway,
        studentGateway,
        accountGateway
      )
    ).handle(req, res);
  }));

  app.use('/analytics', router);
};
