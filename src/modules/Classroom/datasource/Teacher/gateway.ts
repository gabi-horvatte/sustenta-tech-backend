import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { Teacher } from "./model";

export default class TeacherGateway implements TableDataGateway<Teacher, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Teacher, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query("INSERT INTO teacher (id,manager) VALUES ($1,$2)", [data.id, data.manager]);
  }

  async update(data: Omit<Teacher, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query("UPDATE teacher SET manager = $1, updated_at = $2 WHERE id = $3", [data.manager, new Date(), data.id]);
  }

  async findById(identifier: { id: string }): Promise<Teacher | null> {
    const result = await this.client.query("SELECT * FROM teacher WHERE id = $1", [identifier.id]);

    if (result.rows.length === 0)
      return null;

    return result.rows[0];
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM teacher WHERE id = $1", [identifier.id]);
  }
}