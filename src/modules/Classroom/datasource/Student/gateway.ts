import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { Student } from "./model";

export default class StudentGateway implements TableDataGateway<Student, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Student, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query("INSERT INTO student (id,classroom_id,code) VALUES ($1,$2,$3)", [data.id, data.classroom_id, data.code]);
  }

  async update(data: Omit<Student, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query("UPDATE student SET classroom_id = $1, updated_at = $2 WHERE id = $3", [data.classroom_id, new Date(), data.id]);
  }

  async findById(identifier: { id: string }): Promise<Student | null> {
    const result = await this.client.query("SELECT * FROM student WHERE id = $1", [identifier.id]);

    if (result.rows.length === 0)
      return null;

    return result.rows[0];
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM student WHERE id = $1", [identifier.id]);
  }

  async findByClassroomId(identifier: { classroomId: string }): Promise<Student[]> {
    const result = await this.client.query("SELECT * FROM student WHERE classroom_id = $1", [identifier.classroomId]);

    return result.rows;
  }

  async findByIds(identifiers: { id: string }[]): Promise<Student[]> {
    const result = await this.client.query("SELECT * FROM student WHERE id = ANY($1)", [identifiers.map((identifier) => identifier.id)]);

    return result.rows;
  }

  async findAll(): Promise<Student[]> {
    const result = await this.client.query("SELECT * FROM student");
    return result.rows;
  }
}