import type { DbTxType } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema/auth-schema';
import { eq } from 'drizzle-orm';
import { err, ok, Result } from 'neverthrow';

export const getWebsiteRole = async (
	ctx: DbTxType,
	userId: string
): Promise<Result<string, Error>> => {
	try {
		const userWithRole = await ctx.query.usersTable.findFirst({
			where: { id: userId },
			with: {
				websiteRole: true
			}
		});
		if (userWithRole?.websiteRole?.name === undefined) {
			return err(new Error('No role found for user'));
		}
		return ok(userWithRole?.websiteRole?.name);
	} catch (e) {
		console.error('Error in getWebsiteRole:', e);
		return err(new Error('Database query failed'));
	}
};

export const setWebsiteRole = async (
	ctx: DbTxType,
	userId: string,
	roleName: string
): Promise<Result<boolean, Error>> => {
	try {
		// Fetch the role ID based on roleName
		const role = await ctx.query.websiteRolesTable.findFirst({
			where: { name: roleName }
		});
		if (!role) {
			return err(new Error('Role not found'));
		}

		// Update the user's websiteRoleId
		await ctx.update(usersTable).set({ websiteRoleId: role.id }).where(eq(usersTable.id, userId));

		return ok(true);
	} catch (e) {
		console.error('Error in setWebsiteRole:', e);
		return err(new Error('Database operation failed'));
	}
};
