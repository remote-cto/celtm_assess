import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

// Manual .env parser for the script
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

// Create connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

async function migratePasswords() {
    console.log('Connecting to database:', process.env.DATABASE_URL?.split('@')[1] || 'local database');
    console.log('Starting password hashing migration...');

    try {
        let migratedCount = 0;

        // 1. Migrate plain-text passwords already in the academic_user table (e.g. students)
        const result = await pool.query(
            `SELECT id, password FROM academic_user WHERE password IS NOT NULL AND password NOT LIKE '$2%'`
        );

        console.log(`Found ${result.rows.length} users with plain-text passwords in academic_user.`);

        for (const user of result.rows) {
            if (user.password && !user.password.startsWith('$2')) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await pool.query(
                    `UPDATE academic_user SET password = $1 WHERE id = $2`,
                    [hashedPassword, user.id]
                );
                migratedCount++;
                console.log(`Migrated plain-text password for user ID: ${user.id}`);
            }
        }

        // 2. Fallback: Check admins who have a password in admin_credentials but NOT in academic_user
        const adminResult = await pool.query(
            `SELECT au.id, ac.plain_text_password 
             FROM academic_user au 
             JOIN admin_credentials ac ON au.id = ac.academic_user_id
             WHERE (au.password IS NULL OR au.password NOT LIKE '$2%') 
             AND ac.plain_text_password IS NOT NULL`
        );

        console.log(`Found ${adminResult.rows.length} admins in admin_credentials needing migration to academic_user.`);

        for (const admin of adminResult.rows) {
            if (admin.plain_text_password && !admin.plain_text_password.startsWith('$2')) {
                const hashedPassword = await bcrypt.hash(admin.plain_text_password, 10);
                await pool.query(
                    `UPDATE academic_user SET password = $1 WHERE id = $2`,
                    [hashedPassword, admin.id]
                );
                migratedCount++;
                console.log(`Migrated admin password from admin_credentials to academic_user for user ID: ${admin.id}`);
            }
        }

        console.log(`Migration complete! Successfully safely hashed passwords for ${migratedCount} total users.`);

    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        await pool.end();
    }
}

migratePasswords();
