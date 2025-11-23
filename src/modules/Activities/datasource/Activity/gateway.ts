import { PoolClient } from "pg";
import TableDataGateway from '../../../shared/base-gateway';
import { Activity } from "./model";

export default class ActivityGateway implements TableDataGateway<Activity, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Activity, 'created_at' | 'updated_at' | 'deleted_at'>): Promise<void> {
    await this.client.query(`
      INSERT INTO activity (
        id,
        name,
        description,
        classroom_id,
        teacher_id,
        expires_at,
        activity_template_id,
        deleted_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,
      [
        data.id,
        data.name,
        data.description,
        data.classroom_id,
        data.teacher_id,
        data.expires_at,
        data.activity_template_id,
        null
      ]);
  }

  async update(data: Omit<Activity, 'created_at' | 'updated_at' | 'deleted_at'>): Promise<void> {
    await this.client.query(`
      UPDATE activity SET name = $1, description = $2, classroom_id = $3, teacher_id = $4, expires_at = $5, activity_template_id = $6, updated_at = $7 WHERE id = $8
    `,
      [
        data.name,
        data.description,
        data.classroom_id,
        data.teacher_id,
        data.expires_at,
        data.activity_template_id,
        new Date(),
        data.id,
      ]);
  }

  async findById(identifier: { id: string }): Promise<Activity | null> {
    const result = await this.client.query(`
      SELECT activity.* FROM activity 
      INNER JOIN activity_template ON activity.activity_template_id = activity_template.id
      WHERE activity.id = $1 AND activity.deleted_at IS NULL AND activity_template.deleted_at IS NULL
    `, [identifier.id]);

    if (result.rows.length === 0)
      return null;

    return result.rows[0];
  }

  async findByTeacherId(teacherId: string): Promise<Activity[]> {
    const result = await this.client.query(`
      SELECT activity.* FROM activity 
      INNER JOIN activity_template ON activity.activity_template_id = activity_template.id
      WHERE activity.teacher_id = $1 AND activity.deleted_at IS NULL AND activity_template.deleted_at IS NULL
      ORDER BY activity.created_at DESC
    `, [teacherId]);
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("UPDATE activity SET deleted_at = $1, updated_at = $1 WHERE id = $2", [new Date(), identifier.id]);
  }

  async findByIds(identifiers: { id: string }[]): Promise<Activity[]> {
    const result = await this.client.query(`
      SELECT activity.* FROM activity 
      INNER JOIN activity_template ON activity.activity_template_id = activity_template.id
      WHERE activity.id = ANY($1) AND activity.deleted_at IS NULL AND activity_template.deleted_at IS NULL
    `, [identifiers.map((identifier) => identifier.id)]);

    return result.rows;
  }

  async findByClassroomId(identifier: { classroomId: string }): Promise<Activity[]> {
    const result = await this.client.query(`
      SELECT activity.* FROM activity 
      INNER JOIN activity_template ON activity.activity_template_id = activity_template.id
      WHERE activity.classroom_id = $1 AND activity.deleted_at IS NULL AND activity_template.deleted_at IS NULL
    `, [identifier.classroomId]);

    return result.rows;
  }

}