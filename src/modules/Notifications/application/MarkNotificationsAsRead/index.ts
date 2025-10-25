import UseCase from '@/modules/shared/base-use-case';
import NotificationGateway from '../../datasource/Notification/gateway';
import { MarkNotificationsAsReadInput, MarkNotificationsAsReadOutput } from './dto';

export default class MarkNotificationsAsRead extends UseCase<MarkNotificationsAsReadInput, MarkNotificationsAsReadOutput> {
  constructor(private readonly notificationGateway: NotificationGateway) {
    super();
  }

  async execute(input: MarkNotificationsAsReadInput): Promise<MarkNotificationsAsReadOutput> {
    const notifications = await this.notificationGateway.findByIds(input.ids.map((id) => ({ id })));
    const notificationsToUpdate = notifications.filter((notification) => notification.account_id === input.account_id);

    await Promise.all(notificationsToUpdate.map((notification) =>
      this.notificationGateway.update({
        id: notification.id,
        account_id: notification.account_id,
        message: notification.message,
        url: notification.url,
        creation_reason: notification.creation_reason,
        created_by: notification.created_by,
        read_at: new Date(),
      })
    ));

    return {
      ids: notificationsToUpdate.map((notification) => notification.id),
    };
  }
}