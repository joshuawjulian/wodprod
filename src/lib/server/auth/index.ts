import { db } from '$lib/server/db';
import { env } from '$lib/server/env/cli';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { accountsTable, sessionsTable, usersTable, verificationsTable } from '../db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg', // or "mysql", "sqlite",
		schema: {
			user: usersTable,
			session: sessionsTable,
			account: accountsTable,
			verification: verificationsTable
		}
	}),
	secret: env.BETTER_AUTH_SECRET, // Access directly
	baseURL: env.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true
	}
});
