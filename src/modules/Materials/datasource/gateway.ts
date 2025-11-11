import { PoolClient } from "pg";
import TableDataGateway from "../../shared/base-gateway";
import { Material } from "./model";

export default class MaterialGateway implements TableDataGateway<Material, { id: string; student_id: string; }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Material, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO material (id, student_id) VALUES ($1, $2)",
      [data.id, data.student_id]
    );
  }

  async update(data: Omit<Material, 'created_at' | 'updated_at'>): Promise<void> {
    return;
  }

  async findById(identifier: { id: string; student_id: string; }): Promise<Material | null> {
    const result = await this.client.query(
      "SELECT * FROM material WHERE id = $1 AND student_id = $2",
      [identifier.id, identifier.student_id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByStudentId(identifier: { student_id: string }): Promise<Material[]> {
    const result = await this.client.query(
      "SELECT * FROM material WHERE student_id = $1",
      [identifier.student_id]
    );
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM material WHERE id = $1", [identifier.id]);
  }

  async findAll(): Promise<Material[]> {
    const result = await this.client.query("SELECT * FROM material");
    return result.rows;
  }
}