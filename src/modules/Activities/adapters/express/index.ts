import ActivityGateway from '../../datasource/Activity/gateway';
import EditActivityController from './edit-activity';
import EditActivity from '../../application/use-cases/Teacher/EditActivity';
import { asyncHandler } from '@/express/utils/async-handler';
import DeleteActivityController from './delete';
import DeleteActivity from '../../application/use-cases/Teacher/DeleteActivity';
import { Router } from 'express';
import CreateActivityController from './create-activity';
import CreateActivity from '../../application/use-cases/Teacher/CreateActivity';
import ListActivitiesAsTeacher from '../../application/use-cases/Teacher/ListActivities';
import ListActivitiesController from './list';
import GetActivityController from './get';
import GetActivity from '../../application/use-cases/Teacher/GetActivity';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';
import NotificationGateway from '@/modules/Notifications/datasource/Notification/gateway';
import CompleteActivity from '../../application/use-cases/Student/CompleteActivity';
import CompleteActivityController from './complete-activity';
import ActivityStudentGateway from '../../datasource/ActivityStudent/gateway';
import ListActivitiesAsStudent from '../../application/use-cases/Student/ListActivities';

export const setupActivitiesRoutes = (router: Router) => {
  router.put("/activity/:activity_id", asyncHandler(async (req, res, next) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    await new EditActivityController(new EditActivity(activityGateway)).handle(req, res);
  }));

  router.patch("/activity/:activity_id/complete", asyncHandler(async (req, res, next) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    const activityStudentGateway = new ActivityStudentGateway(req.dbClient);
    const notificationGateway = new NotificationGateway(req.dbClient);
    await new CompleteActivityController(new CompleteActivity(activityGateway, activityStudentGateway, notificationGateway)).handle(req, res);
  }));

  router.delete("/activity/:activity_id", asyncHandler(async (req, res, next) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    await new DeleteActivityController(new DeleteActivity(activityGateway)).handle(req, res);
  }));

  router.post("/activity", asyncHandler(async (req, res, next) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    const notificationGateway = new NotificationGateway(req.dbClient);
    await new CreateActivityController(new CreateActivity(activityGateway, studentGateway, notificationGateway)).handle(req, res);
  }));

  router.get("/activity", asyncHandler(async (req, res, next) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    const activityStudentGateway = new ActivityStudentGateway(req.dbClient);
    await new ListActivitiesController(new ListActivitiesAsTeacher(activityGateway), new ListActivitiesAsStudent(studentGateway, activityGateway, activityStudentGateway)).handle(req, res);
  }));

  router.get("/activity/:activity_id", asyncHandler(async (req, res, next) => {
    const activityGateway = new ActivityGateway(req.dbClient);
    await new GetActivityController(new GetActivity(activityGateway)).handle(req, res);
  }));
};