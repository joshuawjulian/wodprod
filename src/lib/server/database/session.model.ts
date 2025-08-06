import type { SessionSelectType } from '$lib/db/schema';
import sql from '../database/client';

export type SessionValidType = {
	userId: number;
	isValid: boolean;
	expiresAt: Date;
};

export async function findSessionByTokenHash(
	refreshTokenHash: string,
): Promise<SessionValidType | null> {
	const [session] = await sql<SessionValidType[]>`
    SELECT user_id AS "userId", is_valid AS "isValid", expires_at AS "expiresAt"
    FROM sessions
    WHERE refresh_token_hash = ${refreshTokenHash}
  `;

	return session || null;
}

export async function upsertSession(
	userId: number,
	refreshTokenHash: string,
	expiresAt: Date,
	isActive: boolean = true,
): Promise<SessionSelectType> {
	const [session] = await sql<SessionSelectType[]>`
    INSERT INTO sessions (user_id, refresh_token_hash, expires_at, is_active)
    VALUES (${userId}, ${refreshTokenHash}, ${expiresAt}, ${isActive})
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        is_active = EXCLUDED.is_active
    RETURNING *;
  `;

	return session;
}

export async function invalidateSessionByRefreshTokenHash(
	refreshTokenHash: string,
): Promise<void> {
	await sql`
    UPDATE sessions
    SET is_active = false
    WHERE refresh_token_hash = ${refreshTokenHash};
  `;
}
