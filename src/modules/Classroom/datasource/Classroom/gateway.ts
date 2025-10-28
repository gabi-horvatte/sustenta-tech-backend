import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { Classroom } from "./model";

export default class ClassroomGateway implements TableDataGateway<Classroom, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Classroom, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO classroom (id, name, description) VALUES ($1, $2, $3)",
      [data.id, data.name, data.description]
    );
  }

  async update(data: Omit<Classroom, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "UPDATE classroom SET name = $1, description = $2, updated_at = $3 WHERE id = $4",
      [data.name, data.description, new Date(), data.id]
    );
  }

  async findById(identifier: { id: string }): Promise<Classroom | null> {
    const result = await this.client.query(
      "SELECT * FROM classroom WHERE id = $1",
      [identifier.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM classroom WHERE id = $1", [identifier.id]);
  }

  async findAll(): Promise<Classroom[]> {
    const result = await this.client.query("SELECT * FROM classroom");
    return result.rows;
  }
}