import { describe, it, expect } from "vitest";
import ClassroomTeacherGateway from "./gateway";
import { Pool, PoolClient } from 'pg';
import ClassroomGateway from "../Classroom/gateway";
import TeacherGateway from "../Teacher/gateway";
import * as uuid from 'uuid';

describe("ClassroomTeacherGateway", () => {
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

  it("should be able to save a classroom teacher", async () => {
    const classroomGateway = new ClassroomGateway(client);
    const teacherGateway = new TeacherGateway(client);
    const gateway = new ClassroomTeacherGateway(client);

    const classroomId = uuid.v4();
    const teacherId = uuid.v4();

    await classroomGateway.insert({
      id: classroomId,
      name: "Classroom 1",
      description: "Description 1",
    });

    await teacherGateway.insert({
      id: teacherId,
      manager: false,
    });

    await gateway.insert({
      classroom_id: classroomId,
      teacher_id: teacherId,
    });

    const classroom = await gateway.findById({ classroom_id: classroomId, teacher_id: teacherId });

    await gateway.delete({ classroom_id: classroomId, teacher_id: teacherId });
    const classroom2 = await gateway.findById({ classroom_id: classroomId, teacher_id: teacherId });

    expect(classroom).toEqual({
      classroom_id: classroomId,
      teacher_id: teacherId,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
    expect(classroom2).toBeNull();
  });
});