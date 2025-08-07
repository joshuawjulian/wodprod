import { goto } from '$app/navigation';
import { jwtDecode } from 'jwt-decode';

// Import the remote function for server-side logout
import { logoutUser } from '$lib/routes/(public)/login/login.remote';
import type { AuthTokenPayload } from '$lib/server/auth';

interface AuthState {
	accessToken: string | null;
	payload: AuthTokenPayload | null;
}

// --- State and Functions ---

// 1. Use `$state` to create a reactive state object.
//    Any component that uses this state will automatically update when it changes.
let state: AuthState = $state({
	accessToken: null,
	playload: null,
});

/**
 * Sets the authentication state after a successful login or token refresh.
 */
function setAuth(accessToken: string): void {
	try {
		const payload: AuthTokenPayload = jwtDecode(accessToken);

		// 2. Directly mutate the state. Svelte 5 handles the reactivity.
		state.accessToken = accessToken;
		state.payload = payload;
	} catch (error) {
		console.error('Failed to decode JWT:', error);
		clearAuth();
	}
}

/**
 * Clears the auth state and tells the server to invalidate the refresh token.
 */
async function logout(): Promise<void> {
	try {
		await logoutUser();
	} catch (error) {
		console.error('Server logout failed, clearing client state anyway.', error);
	} finally {
		clearAuth();
		goto('/login');
	}
}

/**
 * Internal helper to reset the state.
 */
function clearAuth(): void {
	state.accessToken = null;
	state.payload = null;
}

// --- Module Exports ---

// 3. Export a single object with getters for state and methods for actions.
//    Using getters prevents other parts of the app from directly mutating the state
//    (e.g., `auth.user = ...` will not work), enforcing the use of `setAuth` and `logout`.
export const auth = {
	get payload() {
		return state.payload;
	},
	get accessToken() {
		return state.accessToken;
	},
	setAuth,
	logout,
};
