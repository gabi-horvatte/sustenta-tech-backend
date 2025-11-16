import { pool } from '@/database/pool';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway';
import TeacherGateway from '@/modules/Classroom/datasource/Teacher/gateway';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function initializeDefaultManager() {
  const managerEmail = process.env.MANAGER_EMAIL;
  const managerPassword = process.env.MANAGER_PASSWORD;

  if (!managerEmail || !managerPassword) {
    console.log("Skipping manager initialization - MANAGER_EMAIL or MANAGER_PASSWORD not set");
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const accountGateway = new AccountGateway(client);
    const teacherGateway = new TeacherGateway(client);

    // Check if manager account already exists
    const existingAccount = await client.query(
      'SELECT id FROM account WHERE email = $1',
      [managerEmail]
    );

    let accountId: string;

    if (existingAccount.rows.length > 0) {
      // Account exists, update password
      accountId = existingAccount.rows[0].id;
      console.log(`Updating password for existing manager account: ${managerEmail}`);

      const hashedPassword = await bcrypt.hash(managerPassword, 10);
      await client.query(
        'UPDATE account SET password = $1, updated_at = $2 WHERE email = $3',
        [hashedPassword, new Date(), managerEmail]
      );
    } else {
      // Create new manager account
      accountId = uuidv4();
      console.log(`Creating new manager account: ${managerEmail}`);

      await accountGateway.insert({
        id: accountId,
        name: 'System',
        last_name: 'Manager',
        email: managerEmail,
        password: managerPassword, // AccountGateway will hash this
        phone: '+1234567890',
        birth_date: new Date('1990-01-01'),
        role: 'TEACHER'
      });

      // Create teacher record with manager privileges
      await teacherGateway.insert({
        id: accountId,
        manager: true
      });
    }

    // Ensure teacher record exists and has manager privileges
    const existingTeacher = await teacherGateway.findById({ id: accountId });
    if (!existingTeacher) {
      await teacherGateway.insert({
        id: accountId,
        manager: true
      });
    } else if (!existingTeacher.manager) {
      await teacherGateway.update({
        id: accountId,
        manager: true
      });
    }

    await client.query('COMMIT');
    console.log(`Manager account initialized successfully: ${managerEmail}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing manager account:', error);
    throw error;
  } finally {
    client.release();
  }
}
