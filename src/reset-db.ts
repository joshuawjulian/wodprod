// scripts/reset-db.ts
import { sql } from 'drizzle-orm';
import { db } from '../src/lib/server/db';
// OR if you need a raw connection just for this:
// import postgres from 'postgres';
// const sql = postgres(process.env.DATABASE_URL!);

async function reset() {
	console.log('💥 Destroying database schema...');

	// Drop and recreate public schema (Postgres specific)
	await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE;`);
	await db.execute(sql`CREATE SCHEMA public;`);

	// If using specific extensions (like uuid-ossp or vector), re-enable them here:
	// await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

	console.log('✅ Database wiped.');
	process.exit(0);
}

reset().catch((err) => {
	console.error(err);
	process.exit(1);
});
