import type { Cookies } from '@sveltejs/kit';
import argon2 from 'argon2';
import * as crypto from 'crypto';
import { Err, Ok, type Result } from 'ts-results';
import { db } from '../db';

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

export const createAndSetTokens = async (
	email: string,
	cookies: Cookies
): Promise<Result<boolean, Error>> => {
	await db.transaction((tx) => {});
	return Ok(true);
};

export function generateRefreshToken(length: number = 32): string {
	const randomBytes = crypto.randomBytes(length);
	return randomBytes.toString('base64');
}
