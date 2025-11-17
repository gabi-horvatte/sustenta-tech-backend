import { PoolClient } from "pg";
import TableDataGateway from "../../../shared/base-gateway";
import { MaterialTemplate } from "./model";

export default class MaterialTemplateGateway implements TableDataGateway<MaterialTemplate, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<MaterialTemplate, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "INSERT INTO material_template (id, name, description, authors, url, thumbnail, material_type, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [data.id, data.name, data.description, data.authors, data.url, data.thumbnail, data.material_type, data.created_by]
    );
  }

  async update(data: Omit<MaterialTemplate, 'created_at' | 'updated_at'>): Promise<void> {
    await this.client.query(
      "UPDATE material_template SET name = $1, description = $2, authors = $3, url = $4, thumbnail = $5, material_type = $6, updated_at = $7 WHERE id = $8",
      [data.name, data.description, data.authors, data.url, data.thumbnail, data.material_type, new Date(), data.id]
    );
  }

  async findById(identifier: { id: string }): Promise<MaterialTemplate | null> {
    const result = await this.client.query(
      "SELECT * FROM material_template WHERE id = $1",
      [identifier.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findAll(): Promise<MaterialTemplate[]> {
    const result = await this.client.query("SELECT * FROM material_template ORDER BY created_at DESC");
    return result.rows;
  }

  async findByCreatedBy(createdBy: string): Promise<MaterialTemplate[]> {
    const result = await this.client.query(
      "SELECT * FROM material_template WHERE created_by = $1 ORDER BY created_at DESC",
      [createdBy]
    );
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM material_template WHERE id = $1", [identifier.id]);
  }
}
