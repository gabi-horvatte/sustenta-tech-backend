import { afterAll, beforeAll } from 'vitest';
import { Pool } from 'pg';

beforeAll(async () => {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sustentatech',
    password: 'secret',
    port: 5432,
  });

  // @ts-expect-error - test is not defined in the global scope
  global.pool = pool;
});

afterAll(async () => {
  // @ts-expect-error - pool is not defined in the global scope
  global.pool.end();
});