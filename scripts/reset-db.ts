import { sql } from '../src/lib/server/db/index';
import { seedDb } from './seed-db';

async function resetDatabase() {
	console.log('🔄 Resetting database...');

	try {
		// Drop and recreate schema
		await sql`DROP SCHEMA IF EXISTS public CASCADE`;
		await sql`CREATE SCHEMA public`;

		await sql`
			CREATE TABLE website_roles (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL	
			)
		`;

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
			CREATE TABLE users_website_roles (
				id SERIAL PRIMARY KEY,
				user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
				website_role_id INTEGER REFERENCES website_roles(id) NOT NULL
			)
		`


		console.log('✅ Tables created');
		console.log('🔄 Seeding database...');
		await seedDb();
		console.log('✅ Seeding Complete');
		console.log('✅ Database reset complete');
	} catch (error) {
		console.error('❌ Database reset failed:', error);
		process.exit(1);
	} finally {
		await sql.end();
	}
}

resetDatabase();
