import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { ClassroomTeacher } from "./model";

export default class ClassroomTeacherGateway
  implements TableDataGateway<ClassroomTeacher, { classroom_id: string, teacher_id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<ClassroomTeacher, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO classroom_teacher (classroom_id, teacher_id) VALUES ($1, $2)",
      [data.classroom_id, data.teacher_id]
    );
  }

  async update(data: Omit<ClassroomTeacher, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "UPDATE classroom_teacher SET updated_at = $1 WHERE classroom_id = $2 AND teacher_id = $3",
      [new Date(), data.classroom_id, data.teacher_id]
    );
  }

  async findById(identifier: { classroom_id: string, teacher_id: string }): Promise<ClassroomTeacher | null> {
    const result = await this.client.query(
      "SELECT * FROM classroom_teacher WHERE classroom_id = $1 AND teacher_id = $2",
      [identifier.classroom_id, identifier.teacher_id]
    );

    if (result.rows.length === 0)
      return null;

    return result.rows[0];
  }

  async delete(identifier: { classroom_id: string, teacher_id: string }): Promise<void> {
    await this.client.query(
      "DELETE FROM classroom_teacher WHERE classroom_id = $1 AND teacher_id = $2",
      [identifier.classroom_id, identifier.teacher_id]
    );
  }
}