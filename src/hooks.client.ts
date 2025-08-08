import { authStore, setTokens } from '$lib/client/authStore'; // A custom store for your tokens
import { type HandleFetch } from '@sveltejs/kit';
import { get } from 'svelte/store';

// A flag to prevent an infinite loop if the refresh token call itself fails
let isRefreshing = false;

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	// Get the current access token from your store or localStorage
	const { accessToken } = get(authStore);

	// Attach the token to the outgoing request's headers
	if (accessToken) {
		request.headers.set('Authorization', `Bearer ${accessToken}`);
	}

	// Make the initial request
	let response = await fetch(request);

	// Check if the request failed because the token expired (HTTP 401)
	// Also check that we're not already in the middle of refreshing the token
	if (response.status === 401 && !isRefreshing) {
		isRefreshing = true;

		// The token expired. Let's try to refresh it.
		const { refreshToken } = get(authStore);

		if (refreshToken) {
			try {
				// IMPORTANT: Use the original, un-hooked `fetch` for the refresh call
				// to avoid an infinite loop of 401s if the refresh token is also invalid.
				const refreshResponse = await window.fetch('/api/auth/refresh', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ refreshToken }),
				});

				if (refreshResponse.ok) {
					console.log('Token refreshed successfully.');
					const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
						await refreshResponse.json();

					// Update your store/localStorage with the new tokens
					setTokens({
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
					});

					// Clone the original request and retry it with the new access token
					const retryRequest = new Request(request);
					retryRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);

					console.log('Retrying the original request...');
					response = await fetch(retryRequest); // Use the hooked fetch for the retry
				} else {
					// Refresh failed, log the user out
					console.error('Failed to refresh token. Logging out.');
					setTokens({ accessToken: null, refreshToken: null });
					// Optionally redirect to the login page
					window.location.href = '/login';
				}
			} catch (e) {
				console.error('Error during token refresh:', e);
				setTokens({ accessToken: null, refreshToken: null });
			} finally {
				isRefreshing = false;
			}
		}
	}

	return response;
};
