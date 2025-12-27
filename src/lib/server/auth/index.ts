import { db } from '$lib/server/db';
import { env } from '$lib/server/env/cli';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { customSession } from 'better-auth/plugins';
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
	baseURL: env.BETTER_AUTH_URL, //env.BETTER_AUTH_URL,
	trustedOrigins: ['http://localhost:5173'],
	emailAndPassword: {
		enabled: true
	},
	plugins: [
		customSession(async ({ user, session }) => {
			// Fetch user with websiteRole relation
			const userWithRole = await db.query.usersTable.findFirst({
				where: {
					id: user.id
				},
				with: {
					websiteRole: true
				}
			});

			return {
				user: {
					...user,
					websiteRole: userWithRole?.websiteRole?.name || 'user'
				},
				session
			};
		})
	]
});
