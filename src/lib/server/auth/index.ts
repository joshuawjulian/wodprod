import type { Cookies } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Err, Ok, type Result } from 'ts-results';
import z from 'zod';
import { db, type DBTRXType } from '../db';
import {
	refreshTokensTable,
	usersTable,
	websiteRolesTable
} from '../db/schema';
import { getUserByEmail } from '../db/users';
import { generateRefreshToken, verifyPassword } from './utils';

export const AuthTokenPayloadSchema = z.object({
	id: z.number(),
	email: z.email(),
	websiteRole: z.union([
		z.literal('user'),
		z.literal('super'),
		z.literal('admin')
	])
});

export type AuthTokenPayloadType = z.infer<typeof AuthTokenPayloadSchema>;

export const getUserAuthPayloadByEmail = async (
	db: DBTRXType,
	email: string
): Promise<Result<AuthTokenPayloadType, Error>> => {
	const userResults = await db
		.select({
			id: usersTable.id,
			email: usersTable.email,
			websiteRole: websiteRolesTable.name
		})
		.from(usersTable)
		.where(eq(usersTable.email, email))
		.leftJoin(
			websiteRolesTable,
			eq(usersTable.websiteRoleId, websiteRolesTable.id)
		);

	await db.query.usersTable.findFirst({
		where: eq(usersTable.email, email),
		with: {
			websiteRole: true
		}
	});
	if (userResults.length !== 1)
		return Err(Error('getUserAuthPayloadByEmail() - Did not get 1 user'));
	const userResult = AuthTokenPayloadSchema.safeParse(userResults[0]);
	if (userResult.error)
		return Err(Error(`getUserAuthPayloadByEmail() - ${userResult.data}`));
	return Ok(userResult.data);
};

export const attemptLogin = async (
	email: string,
	password_raw: string
): Promise<Result<AuthTokenPayloadType, Error>> => {
	const userResult = await getUserByEmail(db, email);
	if (userResult.err) return Err(userResult.val);

	const user = userResult.val;

	const passwordResult = await verifyPassword(user.passwordHash, password_raw);
	if (passwordResult.err) return Err(Error('Incorrect Password'));

	// password is correct here -- login user

	return Ok({
		id: -1,
		email: 'n/a',
		websiteRole: 'user'
	});
};

export const createAndSetNewTokens = async (
	email: string,
	cookies: Cookies
): Promise<Result<boolean, Error>> => {
	const userResult = await getUserByEmail(db, email);
	if (userResult.err) return Err(userResult.val);
	const user = userResult.val;

	const newRefreshToken = await createAndSetRefreshToken(db, user.id);
	if (newRefreshToken.err) return Err(newRefreshToken.val);

	const refreshToken = newRefreshToken.val;

	return Ok(true);
};

export const createAndSetRefreshToken = async (
	db: DBTRXType,
	userId: number
): Promise<Result<{ token: string; expiresAt: string | Date }, Error>> => {
	const token = generateRefreshToken();
	const today = new Date();
	const dateAfter30Days = new Date(today);
	dateAfter30Days.setDate(today.getDate() + 30);
	try {
		await db
			.update(refreshTokensTable)
			.set({ isActive: false })
			.where(eq(refreshTokensTable.userId, userId));
		const refreshResult = await db
			.insert(refreshTokensTable)
			.values({ userId, token, expiresAt: dateAfter30Days.toDateString() })
			.returning({
				token: refreshTokensTable.token,
				expiresAt: refreshTokensTable.expiresAt
			});
		if (refreshResult.length !== 1)
			return Err(Error('refreshResult length not === 1'));
		return Ok(refreshResult[0]);
	} catch (e) {
		if (e instanceof Error) return Err(e);

		return Err(Error('Something failed in createAndSetRefreshToken'));
	}
};
