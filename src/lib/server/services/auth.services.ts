import { JWT_SECRET } from '$env/static/private';
import type { GymRoleAuthType, WebsiteRoleType } from '$lib/db/schema';
import { createHash, randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import sql from '../database/client';
import {
	findSessionByTokenHash,
	upsertSession,
} from '../database/session.model';
import { getUserById } from '../database/user.model';

// Updates the session and returns the refresh and auth tokens.
export async function refreshSession(
	userId: number,
): Promise<{ refreshToken: string; authToken: string }> {
	// verify userId is valid
	const user = await getUserById(userId);
	if (!user) {
		throw new Error('User not found');
	}
	// create new refreshToken
	const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
	const refreshString = generateRefreshTokenString();
	const refreshTokenHash = hashRefreshToken(refreshString);
	const newSession = await upsertSession(
		userId,
		refreshTokenHash,
		refreshTokenExpires,
	);
	const refreshToken = createToken(
		{
			token: refreshString,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(refreshTokenExpires.getTime() / 1000),
		},
		'30d',
	);

	//create auth token
	const authTokenPayload = await getAuthTokenPayloadForUser(userId);
	const authToken = createToken(authTokenPayload, '15m');
	return {
		refreshToken,
		authToken,
	};
}

export async function isRefreshTokenGood(
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

export function generateRefreshTokenString(): string {
	return randomBytes(32).toString('hex');
}

export function hashRefreshToken(refreshToken: string): string {
	return createHash('sha256').update(refreshToken).digest('hex');
}
