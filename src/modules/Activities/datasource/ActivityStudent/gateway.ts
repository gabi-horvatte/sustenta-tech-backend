import { PoolClient } from "pg";
import TableDataGateway from '../../../shared/base-gateway';
import { ActivityStudent } from "./model";

export default class ActivityStudentGateway implements TableDataGateway<ActivityStudent, { activity_id: string, student_id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<ActivityStudent, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(`
      INSERT INTO activity_student (
        activity_id,
        student_id,
        completed_at
      ) VALUES ($1,$2,$3)
    `,
      [
        data.activity_id,
        data.student_id,
        data.completed_at,
      ]);
  }

  async update(data: Omit<ActivityStudent, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(`
      UPDATE activity_student SET activity_id = $1, student_id = $2, completed_at = $3, updated_at = $4 WHERE activity_id = $5 AND student_id = $6
    `,
      [
        data.activity_id,
        data.student_id,
        data.completed_at,
        new Date(),
      ]);
  }

  async findById(identifier: { activity_id: string, student_id: string }): Promise<ActivityStudent | null> {
    const result = await this.client.query("SELECT * FROM activity_student WHERE activity_id = $1 AND student_id = $2", [identifier.activity_id, identifier.student_id]);

    if (result.rows.length === 0)
      return null;

    return result.rows[0];
  }

  async delete(identifier: { activity_id: string, student_id: string }): Promise<void> {
    await this.client.query("DELETE FROM activity_student WHERE activity_id = $1 AND student_id = $2", [identifier.activity_id, identifier.student_id]);
  }

  async findByIds(identifiers: { activity_id: string, student_id: string }[]): Promise<ActivityStudent[]> {
    const result = await this.client.query("SELECT * FROM activity_student WHERE activity_id = ANY($1) AND student_id = ANY($2)", [identifiers.map((identifier) => identifier.activity_id), identifiers.map((identifier) => identifier.student_id)]);

    return result.rows;
  }

  async findByActivityIds(activity_ids: string[]): Promise<ActivityStudent[]> {
    const result = await this.client.query("SELECT * FROM activity_student WHERE activity_id = ANY($1)", [activity_ids]);

    return result.rows;
  }
} 