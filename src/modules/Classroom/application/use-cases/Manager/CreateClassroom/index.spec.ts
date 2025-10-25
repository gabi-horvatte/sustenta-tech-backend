import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Pool, PoolClient } from 'pg';
import * as uuid from 'uuid';
import CreateClassroom from "./index";
import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway';

describe("CreateClassroom", () => {
  let pool: Pool;
  let client: PoolClient;
  let globalResult: {
    classroomId: string;
    classroomName: string;
  };
  let classroomGateway: ClassroomGateway;

  beforeAll(async () => {
    // @ts-expect-error - pool is not defined in the global scope
    pool = global.pool;
    client = await pool.connect();
    await client.query('BEGIN;');

    // Execute the use case and store result globally

    classroomGateway = new ClassroomGateway(client);
    const useCase = new CreateClassroom(classroomGateway);
    const classroomName = "Test Classroom";

    const result = await useCase.execute({
      name: classroomName,
      description: "Test description",
    });

    globalResult = {
      classroomId: result.id,
      classroomName: result.name,
    };
  });

  afterAll(async () => {
    await client.query('ROLLBACK;');
    client.release();
  });

  it("should create a classroom with generated ID when ID is null", () => {
    expect(globalResult.classroomId).toBeDefined();
    expect(globalResult.classroomId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(globalResult.classroomName).toBe("Test Classroom");
  });

  it("should return the correct output format", () => {
    expect(globalResult).toHaveProperty('id');
    expect(globalResult).toHaveProperty('classroomName');
    expect(typeof globalResult.classroomId).toBe('string');
    expect(typeof globalResult.classroomName).toBe('string');
  });

  it("should persist the classroom in the database", async () => {
    const result = await client.query(
      "SELECT * FROM classroom WHERE id = $1",
      [globalResult.classroomId]
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      id: globalResult.classroomId,
      name: globalResult.classroomName,
      description: "Test description",
    });
    expect(result.rows[0].created_at).toBeInstanceOf(Date);
    expect(result.rows[0].updated_at).toBeInstanceOf(Date);
  });

  it("should create classroom with provided ID when ID is given", async () => {
    const useCase = new CreateClassroom(classroomGateway);
    const customId = uuid.v4();

    const result = await useCase.execute({
      id: customId,
      name: "Custom ID Classroom",
      description: "Test description",
    });

    expect(result.id).toBe(customId);
    expect(result.name).toBe("Custom ID Classroom");

    // Verify in database
    const dbResult = await client.query(
      "SELECT * FROM classroom WHERE id = $1",
      [customId]
    );
    expect(dbResult.rows).toHaveLength(1);
    expect(dbResult.rows[0].id).toBe(customId);
  });
});
