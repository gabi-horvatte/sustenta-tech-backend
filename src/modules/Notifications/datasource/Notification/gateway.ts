import { PoolClient } from "pg";
import TableDataGateway from '../../../Classroom/datasource/base-gateway';
import { Notification } from "./model";

export default class NotificationGateway implements TableDataGateway<Notification, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Notification, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(`
      INSERT INTO notification (
        id,
        account_id,
        message,
        url,
        creation_reason,
        created_by
      ) VALUES ($1,$2,$3,$4,$5,$6)
    `,
      [
        data.id,
        data.account_id,
        data.message,
        data.url,
        data.creation_reason,
        data.created_by,
      ]);
  }

  async update(data: Omit<Notification, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(`
      UPDATE notification SET account_id = $1, message = $2, url = $3, creation_reason = $4, created_by = $5 WHERE id = $6
    `,
      [
        data.account_id,
        data.message,
        data.url,
        data.creation_reason,
        data.created_by,
        data.id,
      ]);
  }

  async findById(identifier: { id: string }): Promise<Notification | null> {
    const result = await this.client.query("SELECT * FROM notification WHERE id = $1", [identifier.id]);

    if (result.rows.length === 0)
      return null;

    return result.rows[0];
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM notification WHERE id = $1", [identifier.id]);
  }

  async findByIds(identifiers: { id: string }[]): Promise<Notification[]> {
    const result = await this.client.query("SELECT * FROM notification WHERE id = ANY($1)", [identifiers.map((identifier) => identifier.id)]);

    return result.rows;
  }

  async findByAccountId(identifier: { accountId: string }): Promise<Notification[]> {
    const result = await this.client.query("SELECT * FROM notification WHERE account_id = $1", [identifier.accountId]);

    return result.rows;
  }

  async findUnreadNotifications(accountId: string): Promise<Notification[]> {
    const result = await this.client.query("SELECT * FROM notification WHERE account_id = $1 AND read_at IS NULL", [accountId]);

    return result.rows;
  }
}