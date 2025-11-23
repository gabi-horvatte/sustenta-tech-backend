import { PoolClient } from "pg";
import TableDataGateway from "../../shared/base-gateway";
import { Material } from "./model";

export default class MaterialGateway implements TableDataGateway<Material, { id: string; student_id: string; }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Material, 'created_at' | 'updated_at' | 'deleted_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO material (id, student_id, deleted_at) VALUES ($1, $2, $3)",
      [data.id, data.student_id, null]
    );
  }

  async update(data: Omit<Material, 'created_at' | 'updated_at' | 'deleted_at'>): Promise<void> {
    return;
  }

  async findById(identifier: { id: string; student_id: string; }): Promise<Material | null> {
    const result = await this.client.query(
      "SELECT * FROM material WHERE id = $1 AND student_id = $2 AND deleted_at IS NULL",
      [identifier.id, identifier.student_id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByStudentId(identifier: { student_id: string }): Promise<Material[]> {
    const result = await this.client.query(
      "SELECT * FROM material WHERE student_id = $1 AND deleted_at IS NULL",
      [identifier.student_id]
    );
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("UPDATE material SET deleted_at = $1, updated_at = $1 WHERE id = $2", [new Date(), identifier.id]);
  }

  async findAll(): Promise<Material[]> {
    const result = await this.client.query("SELECT * FROM material WHERE deleted_at IS NULL");
    return result.rows;
  }
}