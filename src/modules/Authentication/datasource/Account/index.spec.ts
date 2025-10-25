import { describe, it, expect } from "vitest";
import { Pool, PoolClient } from 'pg';
import AccountGateway from "./gateway";
import * as uuid from 'uuid';

describe("AccountGateway", () => {
  let pool: Pool;
  let client: PoolClient;

  beforeAll(async () => {
    // @ts-expect-error - pool is not defined in the global scope
    pool = global.pool;
    client = await pool.connect();
    await client.query('BEGIN;');
  });

  afterAll(async () => {
    await client.query('ROLLBACK;');
  });

  it("should be able to save an account", async () => {
    const gateway = new AccountGateway(client);

    const accountId = uuid.v4();

    await gateway.insert({
      id: accountId,
      birth_date: new Date('2005-01-01'),
      role: 'TEACHER',
      name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phone: "1234567890",
    });

    const account = await gateway.findById({ id: accountId });

    await gateway.delete({ id: accountId });
    const account2 = await gateway.findById({ id: accountId });

    expect(account).toEqual({
      id: accountId,
      birth_date: new Date('2005-01-01'),
      role: 'TEACHER',
      name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phone: "1234567890",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
    expect(account2).toBeNull();
  });
});