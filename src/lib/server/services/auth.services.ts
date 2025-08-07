import { JWT_SECRET } from '$env/static/private';
import type { GymRoleAuthType, WebsiteRoleType } from '$lib/db/schema';
import type { Cookies } from '@sveltejs/kit';
import { createHash, randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import sql from '../database/client';
import {
	findSessionByTokenHash,
	invalidateSessionByRefreshTokenHash,
	upsertSession,
} from '../database/session.model';
import { getUserById } from '../database/user.model';

export async function refreshSessionByRefreshToken(
	refreshToken: string,
): Promise<{
	refreshToken: string;
	refreshTokenExpires: Date;
	authToken: string;
}> {
	const oldRefreshTokenHash = hashRefreshToken(refreshToken);
	const session = await findSessionByTokenHash(oldRefreshTokenHash);
	if (
		!session ||
		!session.isValid ||
		new Date() > new Date(session.expiresAt)
	) {
		throw new Error('Invalid or expired session.');
	}
	const newRefreshTokenExpires = new Date(
		Date.now() + 30 * 24 * 60 * 60 * 1000,
	); // 30 days from now
	const newRefreshToken = generateRefreshToken();
	const newRefreshTokenHash = hashRefreshToken(refreshToken);
	const newSession = await upsertSession(
		session.userId,
		newRefreshTokenHash,
		newRefreshTokenExpires,
	);
	const authTokenPayload = await getAuthTokenPayloadForUser(session.userId);
	const authToken = createToken(authTokenPayload, '15m');
	return {
		refreshToken: newRefreshToken,
		refreshTokenExpires: newRefreshTokenExpires,
		authToken,
	};
}

// Updates the session and returns the refresh and auth tokens.
export async function refreshSession(userId: number): Promise<{
	refreshToken: string;
	refreshTokenExpires: Date;
	authToken: string;
}> {
	// verify userId is valid
	const user = await getUserById(userId);
	if (!user) {
		throw new Error('User not found');
	}
	// create new refreshToken
	const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
	const refreshToken = generateRefreshToken();
	const refreshTokenHash = hashRefreshToken(refreshToken);
	const newSession = await upsertSession(
		userId,
		refreshTokenHash,
		refreshTokenExpires,
	);

	//create auth token
	const authTokenPayload = await getAuthTokenPayloadForUser(userId);
	const authToken = createToken(authTokenPayload, '15m');
	return {
		refreshToken,
		refreshTokenExpires,
		authToken,
	};
}

export async function isRefreshTokenValid(
	refreshToken: string,
): Promise<boolean> {
	const refreshTokenHash = createHash('sha256')
		.update(refreshToken)
		.digest('hex');
	const session = await findSessionByTokenHash(refreshTokenHash);
	if (
		!session ||
		!session.isValid ||
		new Date() > new Date(session.expiresAt)
	) {
		return false;
	}
	return true;
}

export async function getAuthTokenPayloadForUser(
	userId: number,
): Promise<AuthTokenPayload> {
	const [user] = await sql<AuthTokenPayload[]>`
    SELECT id AS userId, website_role AS websiteRole, gym_roles AS gymRoles
    FROM users
    WHERE id = ${userId}
  `;
	if (!user) {
		throw new Error('User not found');
	}
	return user;
}

type RefreshTokenPayload = {
	token: string;
	iat: number; // Issued at time
	exp: number; // Expiration time
};

type AuthTokenPayload = {
	userId: number;
	websiteRole: WebsiteRoleType;
	gymRoles: [GymRoleAuthType];
};

export function createToken(
	payload: RefreshTokenPayload | AuthTokenPayload,
	expiresIn: number | StringValue,
): string {
	return sign(payload, JWT_SECRET, { expiresIn });
}

export function generateRefreshToken(): string {
	return randomBytes(32).toString('hex');
}

export function hashRefreshToken(refreshToken: string): string {
	return createHash('sha256').update(refreshToken).digest('hex');
}

export const refreshUserToken = async (userId: number, cookies: Cookies) => {
	// 1. Get the refresh token from the secure, httpOnly cookie.
	const oldRefreshToken = cookies.get('refresh_token');

	if (!oldRefreshToken) {
		throw new Error('Refresh token not found.');
	}

	try {
		// 2. Hash the incoming token to find it in the database.
		// NEVER store raw tokens; always store a hash.
		const oldTokenHash = hashRefreshToken(oldRefreshToken);
		const session = await findSessionByTokenHash(oldTokenHash);

		// 3. Validate the session.
		if (
			!session ||
			!session.isValid ||
			new Date() > new Date(session.expiresAt)
		) {
			// If the session is invalid or expired, clear the cookie and refuse to refresh.
			cookies.delete('refresh_token', { path: '/' });
			throw new Error('Invalid or expired session.');
		}

		// --- Refresh Token Rotation ---
		// 4. Invalidate the old token to prevent reuse.
		await invalidateSessionByRefreshTokenHash(oldTokenHash);

		// 5. Generate a NEW auth token and a NEW refresh token.
		const { refreshToken, refreshTokenExpires, authToken } =
			await refreshSession(session.userId);

		// 7. Set the new refresh token in a secure cookie.
		cookies.set('refresh_token', refreshToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
			expires: refreshTokenExpires,
		});

		// 8. Return the new auth token in the response body.
		return { authToken };
	} catch (err) {
		console.error('Error during token refresh:', err);
		throw new Error(`An internal error occurred. ${err}`);
	}
};

export const refreshTokenCookieName = 'refresh_token';
