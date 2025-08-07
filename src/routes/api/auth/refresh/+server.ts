import { error, json, type RequestHandler } from '@sveltejs/kit';

// Import your centralized authentication service
import * as authService from '$lib/server/services/auth.services';

/**
 * Handles the POST request to refresh authentication tokens.
 * This endpoint is called by the client-side hook when an access token expires.
 */
export const POST: RequestHandler = async ({ cookies }) => {
	// 1. Get the refresh token from the secure, HttpOnly cookie.
	const oldRefreshToken = cookies.get(authService.refreshTokenCookieName);

	if (!oldRefreshToken) {
		// If there's no refresh token, the user is not properly logged in.
		throw error(401, 'Refresh token not found.');
	}

	try {
		// 2. Call the centralized auth service to validate the refresh token
		// and generate a new pair of tokens.
		const { refreshToken, refreshTokenExpires, authToken } =
			await authService.refreshSessionByRefreshToken(oldRefreshToken);

		// 3. Set the new HttpOnly refresh token cookie on the response.
		// The browser will automatically store this secure cookie.
		// The header value is prepared by the auth service to ensure consistency.
		cookies.set(authService.refreshTokenCookieName, refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
			expires: refreshTokenExpires,
			path: '/', // Ensure the cookie is accessible across the app
		});

		// 4. Return the new access token in the JSON response body.
		// The client-side hook will read this and store it in memory.
		return json({ authToken });
	} catch (err) {
		// 5. If the service throws an error (e.g., token is invalid, expired, or revoked),
		// clear the invalid cookie and throw a 401 error. The client hook
		// will interpret this as a final failure and log the user out.
		cookies.delete(authService.refreshTokenCookieName, { path: '/' });
		throw error(401, 'Invalid or expired refresh token.');
	}
};
