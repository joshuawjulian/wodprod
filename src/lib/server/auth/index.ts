import { db, type DbTxType } from '$lib/server/db';
import { env } from '$lib/server/env/cli';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { customSession } from 'better-auth/plugins';
import { sql } from 'drizzle-orm';
import {
	accountsTable,
	sessionsTable,
	usersTable,
	usersToWebsiteRolesTable,
	verificationsTable,
	websiteRolesTable
} from '../db/schema';

const getWebsiteRole = async (ctx: DbTxType, userId: string) => {
	const userWithRole = await db.query.usersTable.findFirst({
		where: { id: userId },
		with: {
			websiteRoles: {
				limit: 1
			}
		}
	});
	return userWithRole?.websiteRoles[0] || null;
};

const newUserToRole = async (ctx: DbTxType, userId: string, role: string = 'user') => {
	const websiteRoleSQL = sql`(select ${websiteRolesTable.id} from ${websiteRolesTable} where ${websiteRolesTable.name} = ${role} limit 1)`;
	await db.insert(usersToWebsiteRolesTable).values({
		userId: userId,
		websiteRoleId: websiteRoleSQL
	});
};

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
	baseURL: 'http://localhost:5173', //env.BETTER_AUTH_URL,
	trustedOrigins: ['http://localhost:5173'],
	emailAndPassword: {
		enabled: true
	},
	databaseHooks: {
		user: {
			create: {
				// Run this immediately after a new user is inserted
				after: async (user) => {
					await newUserToRole(db, user.id, 'user');
				}
			}
		}
	},
	plugins: [
		customSession(async ({ user, session }) => {
			// Add custom data to session object
			const websiteRole = await getWebsiteRole(db, user.id);
			return {
				user: {
					...user,
					websiteRole: websiteRole ? websiteRole.name : null
				},
				session
			};
		})
	]
});
