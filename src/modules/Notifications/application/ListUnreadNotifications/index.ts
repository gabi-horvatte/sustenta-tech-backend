import UseCase from '@/modules/shared/base-use-case';
import NotificationGateway from '../../datasource/Notification/gateway';
import { ListUnreadNotificationsInput, ListUnreadNotificationsOutput } from './dto';

export default class ListUnreadNotifications extends UseCase<ListUnreadNotificationsInput, ListUnreadNotificationsOutput> {
  constructor(private readonly notificationGateway: NotificationGateway) {
    super();
  }

  async execute(input: ListUnreadNotificationsInput): Promise<ListUnreadNotificationsOutput> {
    const notifications = await this.notificationGateway.findUnreadNotifications(input.account_id);

    return notifications.map((notification) => ({
      id: notification.id,
      account_id: notification.account_id,
      message: notification.message,
      url: notification.url,
      created_at: notification.created_at.toISOString(),
    }));
  }
}