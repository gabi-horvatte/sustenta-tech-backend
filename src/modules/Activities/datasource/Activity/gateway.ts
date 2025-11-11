import { PoolClient } from "pg";
import TableDataGateway from '../../../shared/base-gateway';
import { Activity } from "./model";

export default class ActivityGateway implements TableDataGateway<Activity, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Activity, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(`
      INSERT INTO activity (
        id,
        name,
        description,
        url,
        classroom_id,
        teacher_id,
        expires_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
      [
        data.id,
        data.name,
        data.description,
        data.url,
        data.classroom_id,
        data.teacher_id,
        data.expires_at
      ]);
  }

  async update(data: Omit<Activity, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(`
      UPDATE activity SET name = $1, description = $2, url = $3, classroom_id = $4, teacher_id = $5, expires_at = $6, updated_at = $7 WHERE id = $8
    `,
      [
        data.name,
        data.description,
        data.url,
        data.classroom_id,
        data.teacher_id,
        data.expires_at,
        new Date(),
        data.id,
      ]);
  }

  async findById(identifier: { id: string }): Promise<Activity | null> {
    const result = await this.client.query("SELECT * FROM activity WHERE id = $1", [identifier.id]);

    if (result.rows.length === 0)
      return null;

    return result.rows[0];
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM activity WHERE id = $1", [identifier.id]);
  }

  async findByIds(identifiers: { id: string }[]): Promise<Activity[]> {
    const result = await this.client.query("SELECT * FROM activity WHERE id = ANY($1)", [identifiers.map((identifier) => identifier.id)]);

    return result.rows;
  }

  async findByClassroomId(identifier: { classroomId: string }): Promise<Activity[]> {
    const result = await this.client.query("SELECT * FROM activity WHERE classroom_id = $1", [identifier.classroomId]);

    return result.rows;
  }

  async findByTeacherId(identifier: { teacherId: string }): Promise<Activity[]> {
    const result = await this.client.query("SELECT * FROM activity WHERE teacher_id = $1", [identifier.teacherId]);

    return result.rows;
  }
}