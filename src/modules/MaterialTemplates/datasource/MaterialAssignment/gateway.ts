import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { MaterialAssignment } from "./model";

export default class MaterialAssignmentGateway implements TableDataGateway<MaterialAssignment, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<MaterialAssignment, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO material_assignment (id, material_template_id, classroom_id, assigned_by, expires_at) VALUES ($1, $2, $3, $4, $5)",
      [data.id, data.material_template_id, data.classroom_id, data.assigned_by, data.expires_at]
    );
  }

  async update(data: Omit<MaterialAssignment, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "UPDATE material_assignment SET expires_at = $1, updated_at = $2 WHERE id = $3",
      [data.expires_at, new Date(), data.id]
    );
  }

  async findById(identifier: { id: string }): Promise<MaterialAssignment | null> {
    const result = await this.client.query(
      "SELECT * FROM material_assignment WHERE id = $1",
      [identifier.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByClassroomId(classroomId: string): Promise<MaterialAssignment[]> {
    const result = await this.client.query(
      "SELECT * FROM material_assignment WHERE classroom_id = $1 ORDER BY created_at DESC",
      [classroomId]
    );
    return result.rows;
  }

  async findByAssignedBy(assignedBy: string): Promise<MaterialAssignment[]> {
    const result = await this.client.query(
      "SELECT * FROM material_assignment WHERE assigned_by = $1 ORDER BY created_at DESC",
      [assignedBy]
    );
    return result.rows;
  }

  async findAll(): Promise<MaterialAssignment[]> {
    const result = await this.client.query(
      "SELECT * FROM material_assignment ORDER BY created_at DESC"
    );
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM material_assignment WHERE id = $1", [identifier.id]);
  }
}
