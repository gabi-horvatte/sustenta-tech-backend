import { Router } from 'express';
import { asyncHandler } from '@/express/utils/async-handler';
import NotificationGateway from '../../datasource/Notification/gateway';
import ListUnreadNotificationsController from './list';
import ListUnreadNotifications from '../../application/ListUnreadNotifications';
import MarkNotificationsAsReadController from './mark-notifications-as-read';
import MarkNotificationsAsRead from '../../application/MarkNotificationsAsRead';

export const setupNotificationsRoutes = (router: Router) => {
  router.get("/notification", asyncHandler(async (req, res, next) => {
    const notificationGateway = new NotificationGateway(req.dbClient);
    await new ListUnreadNotificationsController(new ListUnreadNotifications(notificationGateway)).handle(req, res);
  }));

  router.post("/notification/mark-as-read", asyncHandler(async (req, res, next) => {
    const notificationGateway = new NotificationGateway(req.dbClient);
    await new MarkNotificationsAsReadController(new MarkNotificationsAsRead(notificationGateway)).handle(req, res);
  }));
};