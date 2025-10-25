import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Pool, PoolClient } from 'pg';
import * as uuid from 'uuid';
import CreateTeacher from "./index";
import TeacherGateway from "../../../../datasource/Teacher/gateway";
import AccountGateway from "../../../../../Authentication/datasource/Account/gateway";

describe("CreateTeacher", () => {
  let pool: Pool;
  let client: PoolClient;
  let globalResult: {
    teacherId: string;
    isManager: boolean;
  };

  beforeAll(async () => {
    // @ts-expect-error - pool is not defined in the global scope
    pool = global.pool;
    client = await pool.connect();
    await client.query('BEGIN;');

    // Execute the use case and store result globally
    const useCase = new CreateTeacher(new TeacherGateway(client), new AccountGateway(client));

    const result = await useCase.execute({
      id: null,
      manager: true,
      name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phone: "1234567890",
      birth_date: new Date('2005-01-01'),
    });

    globalResult = {
      teacherId: result.id,
      isManager: result.manager,
    };
  });

  afterAll(async () => {
    await client.query('ROLLBACK;');
    client.release();
  });

  it("should create a teacher with generated ID when ID is null", () => {
    expect(globalResult.teacherId).toBeDefined();
    expect(globalResult.teacherId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(globalResult.isManager).toBe(true);
  });

  it("should return the correct output format", () => {
    expect(globalResult).toHaveProperty('teacherId');
    expect(globalResult).toHaveProperty('isManager');
    expect(typeof globalResult.teacherId).toBe('string');
    expect(typeof globalResult.isManager).toBe('boolean');
  });

  it("should persist the teacher in the database", async () => {
    const result = await client.query(
      "SELECT * FROM teacher WHERE id = $1",
      [globalResult.teacherId]
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      id: globalResult.teacherId,
      manager: globalResult.isManager,
    });
    expect(result.rows[0].created_at).toBeInstanceOf(Date);
    expect(result.rows[0].updated_at).toBeInstanceOf(Date);
  });

  it("should create teacher with provided ID when ID is given", async () => {
    const useCase = new CreateTeacher(new TeacherGateway(client), new AccountGateway(client));
    const customId = uuid.v4();

    const result = await useCase.execute({
      id: customId,
      manager: false,
      name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phone: "1234567890",
      birth_date: new Date('2005-01-01'),
    });

    expect(result.id).toBe(customId);
    expect(result.manager).toBe(false);

    // Verify in database
    const dbResult = await client.query(
      "SELECT * FROM teacher WHERE id = $1",
      [customId]
    );
    expect(dbResult.rows).toHaveLength(1);
    expect(dbResult.rows[0].id).toBe(customId);
    expect(dbResult.rows[0].manager).toBe(false);
  });

  it("should handle both manager and non-manager teachers", async () => {
    const useCase = new CreateTeacher(new TeacherGateway(client), new AccountGateway(client));

    // Create non-manager teacher
    const nonManagerResult = await useCase.execute({
      id: null,
      manager: false,
      name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phone: "1234567890",
      birth_date: new Date('2005-01-01'),
    });

    expect(nonManagerResult.manager).toBe(false);

    // Verify in database
    const dbResult = await client.query(
      "SELECT * FROM teacher WHERE id = $1",
      [nonManagerResult.id]
    );
    expect(dbResult.rows[0].manager).toBe(false);
  });

  it("should create manager teacher correctly", () => {
    // This verifies the global result from beforeAll
    expect(globalResult.isManager).toBe(true);
  });
});
