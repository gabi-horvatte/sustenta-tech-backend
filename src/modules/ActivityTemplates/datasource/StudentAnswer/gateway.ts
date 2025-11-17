import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { StudentAnswer } from "./model";

export default class StudentAnswerGateway implements TableDataGateway<StudentAnswer, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<StudentAnswer, 'answered_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO student_answer (id, activity_id, student_id, question_id, selected_option_id, is_correct) VALUES ($1, $2, $3, $4, $5, $6)",
      [data.id, data.activity_id, data.student_id, data.question_id, data.selected_option_id, data.is_correct]
    );
  }

  async update(data: Omit<StudentAnswer, 'answered_at'>): Promise<void> {
    await this.client.query(
      "UPDATE student_answer SET selected_option_id = $1, is_correct = $2 WHERE id = $3",
      [data.selected_option_id, data.is_correct, data.id]
    );
  }

  async findById(identifier: { id: string }): Promise<StudentAnswer | null> {
    const result = await this.client.query(
      "SELECT * FROM student_answer WHERE id = $1",
      [identifier.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByActivityAndStudent(activityId: string, studentId: string): Promise<StudentAnswer[]> {
    const result = await this.client.query(
      "SELECT * FROM student_answer WHERE activity_id = $1 AND student_id = $2 ORDER BY answered_at ASC",
      [activityId, studentId]
    );
    return result.rows;
  }

  async findByActivity(activityId: string): Promise<StudentAnswer[]> {
    const result = await this.client.query(
      "SELECT * FROM student_answer WHERE activity_id = $1 ORDER BY student_id, answered_at ASC",
      [activityId]
    );
    return result.rows;
  }

  async upsert(data: Omit<StudentAnswer, 'answered_at'>): Promise<void> {
    await this.client.query(
      `INSERT INTO student_answer (id, activity_id, student_id, question_id, selected_option_id, is_correct) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (activity_id, student_id, question_id) 
       DO UPDATE SET selected_option_id = $5, is_correct = $6`,
      [data.id, data.activity_id, data.student_id, data.question_id, data.selected_option_id, data.is_correct]
    );
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM student_answer WHERE id = $1", [identifier.id]);
  }

  async findByActivityIds(activityIds: string[]): Promise<any[]> {
    if (activityIds.length === 0) return [];
    const placeholders = activityIds.map((_, i) => `$${i + 1}`).join(',');
    const result = await this.client.query(`SELECT * FROM student_answer WHERE activity_id IN (${placeholders})`, activityIds);
    return result.rows;
  }
}
