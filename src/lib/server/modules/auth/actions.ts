import type { DbTxType } from '$lib/server/db';
import { err, errAsync, ok, okAsync, Result, type ResultAsync } from 'neverthrow';

export const getWebsiteRole = async (
	ctx: DbTxType,
	userId: string
): Promise<Result<string, Error>> => {
	try {
		const userWithRole = await ctx.query.usersTable.findFirst({
			where: { id: userId },
			with: {
				websiteRoles: {
					limit: 1
				}
			}
		});
		if (userWithRole?.websiteRoles[0]?.name === undefined) {
			return err(new Error('No role found for user'));
		}
		return ok(userWithRole?.websiteRoles[0]?.name);
	} catch (e) {
		console.error('Error in getWebsiteRole:', e);
		return err(new Error('Database query failed'));
	}
};
