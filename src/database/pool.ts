import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  min: 10,
  max: 100,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  maxUses: 10,
  maxLifetimeSeconds: 60
});

// Graceful shutdown
process.on("SIGTERM", async () => { await pool.end(); process.exit(0); });
process.on("SIGINT", async () => { await pool.end(); process.exit(0); });
