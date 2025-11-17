import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { QuestionOption } from "./model";

export default class QuestionOptionGateway implements TableDataGateway<QuestionOption, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<QuestionOption, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO question_option (id, question_id, option_text, is_correct, option_order) VALUES ($1, $2, $3, $4, $5)",
      [data.id, data.question_id, data.option_text, data.is_correct, data.option_order]
    );
  }

  async update(data: Omit<QuestionOption, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "UPDATE question_option SET option_text = $1, is_correct = $2, option_order = $3, updated_at = $4 WHERE id = $5",
      [data.option_text, data.is_correct, data.option_order, new Date(), data.id]
    );
  }

  async findById(identifier: { id: string }): Promise<QuestionOption | null> {
    const result = await this.client.query(
      "SELECT * FROM question_option WHERE id = $1",
      [identifier.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByQuestionId(questionId: string): Promise<QuestionOption[]> {
    const result = await this.client.query(
      "SELECT * FROM question_option WHERE question_id = $1 ORDER BY option_order ASC",
      [questionId]
    );
    return result.rows;
  }

  async findByQuestionIds(questionIds: string[]): Promise<QuestionOption[]> {
    if (questionIds.length === 0) return [];
    
    const placeholders = questionIds.map((_, index) => `$${index + 1}`).join(',');
    const result = await this.client.query(
      `SELECT * FROM question_option WHERE question_id IN (${placeholders}) ORDER BY question_id, option_order ASC`,
      questionIds
    );
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM question_option WHERE id = $1", [identifier.id]);
  }

  async deleteByQuestionId(questionId: string): Promise<void> {
    await this.client.query("DELETE FROM question_option WHERE question_id = $1", [questionId]);
  }
}
