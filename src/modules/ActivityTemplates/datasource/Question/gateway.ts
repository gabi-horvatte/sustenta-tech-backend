import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { Question } from "./model";

export default class QuestionGateway implements TableDataGateway<Question, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Question, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO question (id, activity_template_id, question_text, question_order) VALUES ($1, $2, $3, $4)",
      [data.id, data.activity_template_id, data.question_text, data.question_order]
    );
  }

  async update(data: Omit<Question, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "UPDATE question SET question_text = $1, question_order = $2, updated_at = $3 WHERE id = $4",
      [data.question_text, data.question_order, new Date(), data.id]
    );
  }

  async findById(identifier: { id: string }): Promise<Question | null> {
    const result = await this.client.query(
      "SELECT * FROM question WHERE id = $1",
      [identifier.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByActivityTemplateId(activityTemplateId: string): Promise<Question[]> {
    const result = await this.client.query(
      "SELECT * FROM question WHERE activity_template_id = $1 ORDER BY question_order ASC",
      [activityTemplateId]
    );
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM question WHERE id = $1", [identifier.id]);
  }

  async deleteByActivityTemplateId(activityTemplateId: string): Promise<void> {
    await this.client.query("DELETE FROM question WHERE activity_template_id = $1", [activityTemplateId]);
  }
}
