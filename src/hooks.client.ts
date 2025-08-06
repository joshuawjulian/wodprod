// src/hooks.client.ts
import { browser } from '$app/environment';
import type { HandleFetch } from '@sveltejs/kit';
import { refreshToken } from './routes/auth/data.remote';

// Helper to get a cookie
function getCookie(name: string): string | undefined {
	if (!browser) return undefined;
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	if (match) return match[2];
}

// Store the token in memory to avoid constant cookie parsing
let tokenInMemory: string | null = getCookie('auth_token') || null;

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	// Add the token to the initial request if it exists
	if (tokenInMemory) {
		request.headers.set('Authorization', `Bearer ${tokenInMemory}`);
	}

	// Make the request
	const response = await fetch(request);

	// Check if the token expired (401 status)
	if (response.status === 401) {
		// The token is expired or invalid. Let's try to refresh it.
		const refreshResponse = await refreshToken();

		if (refreshResponse.success) {
			const { authToken } = refreshResponse;
			tokenInMemory = authToken; // Update the in-memory token

			// IMPORTANT: Clone the original request to retry it.
			// Set the new token and resend the original request.
			const retryRequest = new Request(request.url, {
				method: request.method,
				headers: request.headers,
				body: request.body,
				// ... and other options
			});
			retryRequest.headers.set('Authorization', `Bearer ${tokenInMemory}`);

			console.log('Token refreshed, retrying original request...');
			return fetch(retryRequest);
		} else {
			// Refresh failed, log the user out
			tokenInMemory = null;
			// You might want to redirect to /login here
			window.location.href = '/login';
		}
	}

	return response;
};
