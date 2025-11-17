import { PoolClient } from "pg";
import TableDataGateway from '../../../shared/base-gateway';
import { Account } from "./model";
import bcrypt from "bcrypt";

export default class AccountGateway implements TableDataGateway<Account, { id: string }> {
  constructor(private readonly client: PoolClient) { }

  async insert(data: Omit<Account, 'created_at' | 'updated_at'>): Promise<void> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.client.query("INSERT INTO account (id,name,last_name,email,password,phone,birth_date,role) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [data.id, data.name, data.last_name, data.email, hashedPassword, data.phone, data.birth_date, data.role]);
  }

  async update(data: Omit<Account, 'created_at' | 'updated_at'>): Promise<void> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.client.query("UPDATE account SET name = $1, last_name = $2, email = $3, password = $4, phone = $5, birth_date = $6, role = $7, updated_at = $8 WHERE id = $9", [data.name, data.last_name, data.email, hashedPassword, data.phone, data.birth_date, data.role, new Date(), data.id]);
  }

  async findById(identifier: { id: string }): Promise<Account | null> {
    const result = await this.client.query("SELECT * FROM account WHERE id = $1", [identifier.id]);

    if (result.rows.length === 0)
      return null;

    return result.rows[0];
  }

  async findByRole(role: string): Promise<Account[]> {
    const result = await this.client.query("SELECT * FROM account WHERE role = $1", [role]);
    return result.rows;
  }

  async delete(identifier: { id: string }): Promise<void> {
    await this.client.query("DELETE FROM account WHERE id = $1", [identifier.id]);
  }

  async findByIds(identifiers: { id: string }[]): Promise<Account[]> {
    const result = await this.client.query("SELECT * FROM account WHERE id = ANY($1)", [identifiers.map((identifier) => identifier.id)]);

    return result.rows;
  }

  async findByEmailAndPassword(identifier: { email: string, password: string }): Promise<Account | null> {
    const result = await this.client.query("SELECT * FROM account WHERE email = $1", [identifier.email]);

    if (result.rows.length === 0)
      return null;

    const isPasswordValid = await bcrypt.compare(identifier.password, result.rows[0].password);

    if (!isPasswordValid)
      return null;

    return result.rows[0];
  }
}