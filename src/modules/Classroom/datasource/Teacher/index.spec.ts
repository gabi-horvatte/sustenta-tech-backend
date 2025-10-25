import { describe, it, expect } from "vitest";
import ClassroomGateway from "../Classroom/gateway";
import { Pool, PoolClient } from 'pg';
import TeacherGateway from "./gateway";
import * as uuid from 'uuid';

describe("TeacherGateway", () => {
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

  it("should be able to save a teacher", async () => {
    // @ts-expect-error - test is not defined in the global scope
    expect(global.pool).toBeDefined();
    const gateway = new TeacherGateway(client);
    const classroomGateway = new ClassroomGateway(client);

    const classroomId = uuid.v4();
    const teacherId = uuid.v4();

    await classroomGateway.insert({
      id: classroomId,
      name: "Classroom 1",
      description: "Description 1",
    });
    await gateway.insert({
      id: teacherId,
      manager: false,
    });

    const teacher = await gateway.findById({ id: teacherId });

    await gateway.delete({ id: teacherId });
    const teacher2 = await gateway.findById({ id: teacherId });

    expect(teacher).toEqual({
      id: teacherId,
      manager: false,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
    expect(teacher2).toBeNull();
  });
});