import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { MaterialCompletion } from "./model";

export default class MaterialCompletionGateway implements TableDataGateway<MaterialCompletion, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<MaterialCompletion, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO material_completion (id, material_assignment_id, student_id, completed_at) VALUES ($1, $2, $3, $4)",
      [data.id, data.material_assignment_id, data.student_id, data.completed_at]
    );
  }

  async update(data: Omit<MaterialCompletion, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "UPDATE material_completion SET completed_at = $1, updated_at = $2 WHERE id = $3",
      [data.completed_at, new Date(), data.id]
    );
  }

  async findById(identifier: { id: string }): Promise<MaterialCompletion | null> {
    const result = await this.client.query(
      "SELECT * FROM material_completion WHERE id = $1",
      [identifier.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByMaterialAssignmentId(materialAssignmentId: string): Promise<MaterialCompletion[]> {
    const result = await this.client.query(
      "SELECT * FROM material_completion WHERE material_assignment_id = $1 ORDER BY completed_at DESC",
      [materialAssignmentId]
    );
    return result.rows;
  }

  async findByStudentId(studentId: string): Promise<MaterialCompletion[]> {
    const result = await this.client.query(
      "SELECT * FROM material_completion WHERE student_id = $1 ORDER BY completed_at DESC",
      [studentId]
    );
    return result.rows;
  }

  async findByMaterialAssignmentAndStudent(materialAssignmentId: string, studentId: string): Promise<MaterialCompletion | null> {
    const result = await this.client.query(
      "SELECT * FROM material_completion WHERE material_assignment_id = $1 AND student_id = $2",
      [materialAssignmentId, studentId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM material_completion WHERE id = $1", [identifier.id]);
  }

  async findByAssignmentIds(assignmentIds: string[]): Promise<any[]> {
    if (assignmentIds.length === 0) return [];
    const placeholders = assignmentIds.map((_, i) => `$${i + 1}`).join(',');
    const result = await this.client.query(`SELECT * FROM material_completion WHERE material_assignment_id IN (${placeholders})`, assignmentIds);
    return result.rows;
  }
}
