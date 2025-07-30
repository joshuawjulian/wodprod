import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	verbose: true,
	breakpoints: true,
	migrationsFolder: './drizzle/migrations',
	migrationsTable: 'drizzle_migrations',
} as Config);
