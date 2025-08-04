import { json } from '@sveltejs/kit';

// These would be your database functions to find and update sessions
import {
	findSessionByTokenHash,
	invalidateSessionByRefreshTokenHash,
} from '$lib/server/database/session.model';
import {
	hashRefreshToken,
	refreshSession,
} from '$lib/server/services/auth.services.js';

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
		return json({ authToken });
	} catch (err) {
		console.error('Error during token refresh:', err);
		return json({ error: 'An internal error occurred.' }, { status: 500 });
	}
}
