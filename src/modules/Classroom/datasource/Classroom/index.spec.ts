import { describe, it, expect } from "vitest";
import ClassroomGateway from "./gateway";
import { Pool, PoolClient } from 'pg';

describe("ClassroomGateway", () => {
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

  it("should be able to save a classroom", async () => {
    // @ts-expect-error - test is not defined in the global scope
    expect(global.pool).toBeDefined();
    const gateway = new ClassroomGateway(client);
    await gateway.insert({
      id: "1",
      name: "Classroom 1",
      description: "Description 1",
    });

    const classroom = await gateway.findById({ id: "1" });

    await gateway.delete({ id: "1" });
    const classroom2 = await gateway.findById({ id: "1" });

    expect(classroom).toEqual({
      id: "1",
      name: "Classroom 1",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      description: "Description 1",
    });
    expect(classroom2).toBeNull();
  });
});