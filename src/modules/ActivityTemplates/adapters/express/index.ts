import { Router } from "express";
import { asyncHandler } from '@/server/utils/async-handler';

// Gateways
import ActivityTemplateGateway from '../../datasource/ActivityTemplate/gateway';
import QuestionGateway from '../../datasource/Question/gateway';
import QuestionOptionGateway from '../../datasource/QuestionOption/gateway';
import StudentAnswerGateway from '../../datasource/StudentAnswer/gateway';
import ActivityGateway from '@/modules/Activities/datasource/Activity/gateway';
import ActivityStudentGateway from '@/modules/Activities/datasource/ActivityStudent/gateway';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';

// Use Cases
import CreateActivityTemplate from '../../application/use-cases/CreateActivityTemplate';
import ListActivityTemplates from '../../application/use-cases/ListActivityTemplates';
import GetActivityTemplate from '../../application/use-cases/GetActivityTemplate';
import SubmitStudentAnswers from '../../application/use-cases/SubmitStudentAnswers';
import GetStudentProgress from '../../application/use-cases/GetStudentProgress';

// Controllers
import CreateActivityTemplateController from './create-activity-template';
import ListActivityTemplatesController from './list-activity-templates';
import GetActivityTemplateController from './get-activity-template';
import SubmitStudentAnswersController from './submit-student-answers';
import GetStudentProgressController from './get-student-progress';

export const setupActivityTemplatesRoutes = (router: Router) => {
  // Create activity template
  router.post("/activity-template", asyncHandler(async (req, res) => {
    const activityTemplateGateway = new ActivityTemplateGateway(req.dbClient);
    const questionGateway = new QuestionGateway(req.dbClient);
    const questionOptionGateway = new QuestionOptionGateway(req.dbClient);
    
    const notificationGateway = new NotificationGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    
    await new CreateActivityTemplateController(
      new CreateActivityTemplate(activityTemplateGateway, questionGateway, questionOptionGateway, notificationGateway, accountGateway)
    ).handle(req, res);
  }));

  // List activity templates
  router.get("/activity-template", asyncHandler(async (req, res) => {
    const activityTemplateGateway = new ActivityTemplateGateway(req.dbClient);
    const questionGateway = new QuestionGateway(req.dbClient);
    
    await new ListActivityTemplatesController(
      new ListActivityTemplates(activityTemplateGateway, questionGateway)
    ).handle(req, res);
  }));

  // Get specific activity template
  router.get("/activity-template/:id", asyncHandler(async (req, res) => {
    const activityTemplateGateway = new ActivityTemplateGateway(req.dbClient);
    const questionGateway = new QuestionGateway(req.dbClient);
    const questionOptionGateway = new QuestionOptionGateway(req.dbClient);
    
    await new GetActivityTemplateController(
      new GetActivityTemplate(activityTemplateGateway, questionGateway, questionOptionGateway)
    ).handle(req, res);
  }));

  // Submit student answers for an activity
  router.post("/activity/:activity_id/submit-answers", asyncHandler(async (req, res) => {
    const studentAnswerGateway = new StudentAnswerGateway(req.dbClient);
    const questionOptionGateway = new QuestionOptionGateway(req.dbClient);
    const activityGateway = new ActivityGateway(req.dbClient);
    const activityStudentGateway = new ActivityStudentGateway(req.dbClient);
    const notificationGateway = new NotificationGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    const classroomGateway = new ClassroomGateway(req.dbClient);
    
    await new SubmitStudentAnswersController(
      new SubmitStudentAnswers(studentAnswerGateway, questionOptionGateway, activityGateway, activityStudentGateway, notificationGateway, accountGateway, classroomGateway)
    ).handle(req, res);
  }));

  // Get student progress for an activity
  router.get("/activity/:activity_id/progress", asyncHandler(async (req, res) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    const studentAnswerGateway = new StudentAnswerGateway(req.dbClient);
    const activityStudentGateway = new ActivityStudentGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    const questionGateway = new QuestionGateway(req.dbClient);
    
    await new GetStudentProgressController(
      new GetStudentProgress(activityGateway, studentAnswerGateway, activityStudentGateway, studentGateway, accountGateway, questionGateway)
    ).handle(req, res);
  }));
};
