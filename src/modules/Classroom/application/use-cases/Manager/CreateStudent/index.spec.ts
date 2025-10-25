import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Pool, PoolClient } from 'pg';
import * as uuid from 'uuid';
import CreateStudent from "./index";
import ClassroomGateway from "../../../../datasource/Classroom/gateway";
import StudentGateway from "../../../../datasource/Student/gateway";
import AccountGateway from "../../../../../Authentication/datasource/Account/gateway";

describe("CreateStudent", () => {
  let pool: Pool;
  let client: PoolClient;
  let globalResult: {
    studentId: string;
    classroomId: string;
  };

  beforeAll(async () => {
    // @ts-expect-error - pool is not defined in the global scope
    pool = global.pool;
    client = await pool.connect();
    await client.query('BEGIN;');

    // Create a classroom first (prerequisite)
    const classroomGateway = new ClassroomGateway(client);
    const classroomId = uuid.v4();
    await classroomGateway.insert({
      id: classroomId,
      name: "Test Classroom for Student",
      description: "Test classroom",
    });

    // Execute the use case and store result globally
    const useCase = new CreateStudent(new StudentGateway(client), new AccountGateway(client));

    const result = await useCase.execute({
      id: null,
      birth_date: new Date('2005-01-01'),
      code: "1234567890",
      classroom_id: classroomId,
      name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phone: "1234567890",
    });

    globalResult = {
      studentId: result.id,
      classroomId: result.classroom_id,
    };
  });

  afterAll(async () => {
    await client.query('ROLLBACK;');
    client.release();
  });

  it("should create a student with generated ID when ID is null", () => {
    expect(globalResult.studentId).toBeDefined();
    expect(globalResult.studentId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(globalResult.classroomId).toBeDefined();
  });

  it("should return the correct output format", () => {
    expect(globalResult).toHaveProperty('studentId');
    expect(globalResult).toHaveProperty('classroomId');
    expect(typeof globalResult.studentId).toBe('string');
    expect(typeof globalResult.classroomId).toBe('string');
  });

  it("should persist the student in the database", async () => {
    const result = await client.query(
      "SELECT * FROM student WHERE id = $1",
      [globalResult.studentId]
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      id: globalResult.studentId,
      classroom_id: globalResult.classroomId,
    });
    expect(result.rows[0].created_at).toBeInstanceOf(Date);
    expect(result.rows[0].updated_at).toBeInstanceOf(Date);
  });

  it("should create student with provided ID when ID is given", async () => {
    const useCase = new CreateStudent(new StudentGateway(client), new AccountGateway(client));
    const customId = uuid.v4();

    const result = await useCase.execute({
      id: customId,
      birth_date: new Date('2005-01-01'),
      code: "1234567890",
      classroom_id: globalResult.classroomId,
      name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phone: "1234567890",
    });

    expect(result.id).toBe(customId);
    expect(result.classroom_id).toBe(globalResult.classroomId);

    // Verify in database
    const dbResult = await client.query(
      "SELECT * FROM student WHERE id = $1",
      [customId]
    );
    expect(dbResult.rows).toHaveLength(1);
    expect(dbResult.rows[0].id).toBe(customId);
  });

  it("should link student to the correct classroom", async () => {
    // Verify the relationship exists
    const result = await client.query(
      `SELECT s.*, c.name as classroom_name 
       FROM student s 
       JOIN classroom c ON s.classroom_id = c.id 
       WHERE s.id = $1`,
      [globalResult.studentId]
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].classroom_name).toBe("Test Classroom for Student");
  });
});
