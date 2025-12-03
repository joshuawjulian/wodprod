// scripts/nuke.ts
import { rm } from 'node:fs/promises';
import postgres from 'postgres';
import { env } from '../src/lib/server/env/cli';

const run = async () => {
	console.log('☢️  Nuking Database...');

	// 1. Connect to DB
	const sql = postgres(env.DATABASE_URL);

	try {
		// 2. Drop the entire public schema (cascades to all tables/triggers)
		await sql`DROP SCHEMA IF EXISTS public CASCADE`;
		await sql`CREATE SCHEMA public`;
		await sql`GRANT ALL ON SCHEMA public TO public`;
		await sql`COMMENT ON SCHEMA public IS 'standard public schema'`;

		console.log('✅ Database cleared.');
	} catch (e) {
		console.error('❌ DB Error:', e);
		process.exit(1);
	} finally {
		await sql.end();
	}

	// 3. Delete the local 'drizzle' migrations folder
	try {
		await rm('./drizzle', { recursive: true, force: true });
		console.log('✅ Local migrations folder deleted.');
	} catch (e) {
		console.error('❌ FS Error:', e);
	}
};

run();
