import { eq } from 'drizzle-orm';
import { Err, Ok, type Result } from 'ts-results';
import { type DBTRXType } from '.';
import { hashPassword } from '../auth/utils';
import {
	usersTable,
	usersWebsiteRolesTable,
	websiteRolesTable
} from './schema';

export type UserSelectType = {
	id: number;
	email: string;
	passwordHash: string;
	refreshToken: string | null;
	createdAt: string;
	updatedAt: string;
};
export const getUserByEmail = async (
	db: DBTRXType,
	email: string
): Promise<Result<UserSelectType, Error>> => {
	const result = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email));

	if (result.length === 1) {
		return Ok(result[0]);
	}

	return Err(Error('getUserByEmail() did not return a single length array'));
};

export const registerUser = async (
	db: DBTRXType,
	email: string,
	password_raw: string,
	websiteRole: 'user' | 'admin' | 'super' = 'user'
): Promise<Result<UserSelectType, Error>> => {
	return await db.transaction(async (tx) => {
		const passwordHashResult = await hashPassword(password_raw);
		if (passwordHashResult.err) return Err(passwordHashResult.val);
		const passwordHash = passwordHashResult.val;
		const userResult = await tx
			.insert(usersTable)
			.values({
				email,
				passwordHash
			})
			.returning();

		if (userResult.length !== 1)
			return Err(Error('Something happened at register'));

		const user = userResult[0];
		const websiteRolesResult = await tx
			.select()
			.from(websiteRolesTable)
			.where(eq(websiteRolesTable.name, websiteRole));
		if (websiteRolesResult.length !== 1)
			return Err(Error(`${websiteRole} role could not be found`));
		const role = websiteRolesResult[0];

		await tx.insert(usersWebsiteRolesTable).values({
			userId: user.id,
			roleId: role.id
		});

		return Ok(user);
	});
};
