import { json } from '@sveltejs/kit';
import { createHash, randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';

import { JWT_SECRET } from '$env/static/private';
// These would be your database functions to find and update sessions
import { findSessionByTokenHash } from '$lib/server/database/session.model';
import { hashRefreshToken } from '$lib/server/services/auth.services.js';

// This function handles the token refresh request.
export async function POST({ cookies }) {
	// 1. Get the refresh token from the secure, httpOnly cookie.
	const oldRefreshToken = cookies.get('refresh_token');

	if (!oldRefreshToken) {
		return json({ error: 'Refresh token not found.' }, { status: 401 });
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
			return json({ error: 'Invalid or expired session.' }, { status: 401 });
		}

		// --- Refresh Token Rotation ---
		// 4. Invalidate the old token to prevent reuse.
		session.isValid = false;

		// 5. Generate a NEW auth token and a NEW refresh token.
		const newAuthToken = sign({ userId: session.userId }, JWT_SECRET, {
			expiresIn: '15m',
		});
		const newRefreshToken = randomBytes(32).toString('hex');
		const newRefreshTokenHash = createHash('sha256')
			.update(newRefreshToken)
			.digest('hex');
		const newExpiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

		// 6. Update the session in the database with the new refresh token hash and expiry.
		await updateSession(session.id, {
			refreshTokenHash: newRefreshTokenHash,
			expiresAt: newExpiryDate,
			isValid: true,
		});

		// 7. Set the new refresh token in a secure cookie.
		cookies.set('refresh_token', newRefreshToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
			expires: newExpiryDate,
		});

		// 8. Return the new auth token in the response body.
		return json({ newAuthToken });
	} catch (err) {
		console.error('Error during token refresh:', err);
		return json({ error: 'An internal error occurred.' }, { status: 500 });
	}
}
