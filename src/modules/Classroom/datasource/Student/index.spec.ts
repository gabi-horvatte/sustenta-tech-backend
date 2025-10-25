import { describe, it, expect } from "vitest";
import ClassroomGateway from "../Classroom/gateway";
import { Pool, PoolClient } from 'pg';
import StudentGateway from "./gateway";
import * as uuid from 'uuid';

describe("StudentGateway", () => {
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

  it("should be able to save a student", async () => {
    // @ts-expect-error - test is not defined in the global scope
    expect(global.pool).toBeDefined();
    const gateway = new StudentGateway(client);
    const classroomGateway = new ClassroomGateway(client);

    const studentId = uuid.v4();
    const classroomId = uuid.v4();

    await classroomGateway.insert({
      id: classroomId,
      name: "Classroom 1",
      description: "Description 1",
    });
    await gateway.insert({
      id: studentId,
      code: '123456',
      classroom_id: classroomId,
    });

    const student = await gateway.findById({ id: studentId });

    await gateway.delete({ id: studentId });
    const student2 = await gateway.findById({ id: studentId });

    expect(student).toEqual({
      id: studentId,
      classroom_id: classroomId,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
    expect(student2).toBeNull();
  });
});