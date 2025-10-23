import { sql } from '../src/lib/server/db/index';

async function resetDatabase() {
	console.log('🔄 Resetting database...');

	try {
		// Drop and recreate schema
		await sql`DROP SCHEMA IF EXISTS public CASCADE`;
		await sql`CREATE SCHEMA public`;

		// Create tables
		await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
				refresh_token TEXT DEFAULT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

		await sql`
      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

		// Create indexes
		await sql`CREATE INDEX idx_sessions_user_id ON sessions(user_id)`;
		await sql`CREATE INDEX idx_sessions_expires_at ON sessions(expires_at)`;

		console.log('✅ Tables created');

		// Seed data
		await sql`
      INSERT INTO users (email, password_hash) VALUES
        ('dev@example.com', '$2a$10$placeholder_hash_1'),
        ('admin@example.com', '$2a$10$placeholder_hash_2')
    `;

		console.log('✅ Seed data inserted');
		console.log('✅ Database reset complete');
	} catch (error) {
		console.error('❌ Database reset failed:', error);
		process.exit(1);
	} finally {
		await sql.end();
	}
}

resetDatabase();
