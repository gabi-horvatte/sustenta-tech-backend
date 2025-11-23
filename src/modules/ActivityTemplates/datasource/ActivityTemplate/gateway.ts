import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { ActivityTemplate } from "./model";

export default class ActivityTemplateGateway implements TableDataGateway<ActivityTemplate, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<ActivityTemplate, 'created_at' | 'updated_at' | 'deleted_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO activity_template (id, name, description, created_by, deleted_at) VALUES ($1, $2, $3, $4, $5)",
      [data.id, data.name, data.description, data.created_by, null]
    );
  }

  async update(data: Omit<ActivityTemplate, 'created_at' | 'updated_at' | 'deleted_at'>): Promise<void> {
    await this.client.query(
      "UPDATE activity_template SET name = $1, description = $2, updated_at = $3 WHERE id = $4",
      [data.name, data.description, new Date(), data.id]
    );
  }

  async findById(identifier: { id: string }): Promise<ActivityTemplate | null> {
    const result = await this.client.query(
      "SELECT * FROM activity_template WHERE id = $1 AND deleted_at IS NULL",
      [identifier.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findAll(): Promise<ActivityTemplate[]> {
    const result = await this.client.query("SELECT * FROM activity_template WHERE deleted_at IS NULL ORDER BY created_at DESC");
    return result.rows;
  }

  async findByCreatedBy(createdBy: string): Promise<ActivityTemplate[]> {
    const result = await this.client.query(
      "SELECT * FROM activity_template WHERE created_by = $1 AND deleted_at IS NULL ORDER BY created_at DESC",
      [createdBy]
    );
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("UPDATE activity_template SET deleted_at = $1, updated_at = $1 WHERE id = $2", [new Date(), identifier.id]);
  }
}
