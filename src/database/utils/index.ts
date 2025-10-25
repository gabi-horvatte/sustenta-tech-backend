import { pool } from "../pool";
import type { PoolClient } from "pg";

export async function runInTransaction<T>(
  fn: (tx: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await fn(client);

    await client.query("COMMIT");
    return result;
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch { }
    throw err;
  } finally {
    client.release();
  }
}
