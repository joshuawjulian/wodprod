import type { Cookies } from '@sveltejs/kit';
import argon2 from 'argon2';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { Err, Ok, type Result } from 'ts-results';
import { db, type DBTRXType } from '../db';
import { refreshTokensTable } from '../db/schema';
import { getUserByEmail } from '../db/users';

//const secretKey = process.env.AUTH_SECRET;

export async function hashPassword(
	password: string
): Promise<Result<string, Error>> {
	try {
		// Hash the password using Argon2
		return Ok(await argon2.hash(password));
	} catch (error) {
		console.error('Verification failed:', error);
		if (error instanceof Error) {
			return Err(error);
		}
		return Err(new Error('An unknown error occurred'));
	}
}
export async function verifyPassword(
	hashedPassword: string,
	password: string
): Promise<Result<boolean, Error>> {
	try {
		return Ok(await argon2.verify(hashedPassword, password));
	} catch (error) {
		console.error('Verification failed:', error);
		if (error instanceof Error) {
			return Err(error);
		}
		return Err(new Error('An unknown error occurred'));
	}
}

export const createAndSetNewTokens = async (
	email: string,
	cookies: Cookies
): Promise<Result<boolean, Error>> => {
	const userResult = await getUserByEmail(db, email);
	if (userResult.err) return Err(userResult.val);
	const user = userResult.val;

	const newRefreshToken = await createAndSetRefreshToken(db, user.id);

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

export function generateRefreshToken(length: number = 32): string {
	const randomBytes = crypto.randomBytes(length);
	return randomBytes.toString('base64');
}
