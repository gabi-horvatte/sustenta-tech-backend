import { PoolClient } from 'pg';
import { Account } from '@/modules/Authentication/datasource/Account/model';

declare global {
  namespace Express {
    interface Request {
      dbClient: PoolClient;
      account?: (Account & ({ role: 'STUDENT' } | { role: 'TEACHER', manager: boolean }));
    }
  }
}
