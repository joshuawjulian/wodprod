import { JWT_SECRET } from '$env/static/private';
import type { GymRolesAuthType, WebsiteRoleType } from '$lib/db/schema';
import { sign } from 'jsonwebtoken';

interface AuthTokenPayload {
	userId: number;
	websiteRole: WebsiteRoleType;
	gymRoles: [GymRolesAuthType];
}

export async function createAuthTokenForUser(userId: number): Promise<string> {
	// Fetch the user's roles from the database
	const userRoles = await getUserRoles(userId);

	// Create the payload for the JWT
	const payload: AuthTokenPayload = {
		userId,
		websiteRole: userRoles.websiteRole,
		gymRoles: userRoles.gymRoles,
	};

	// Sign the JWT with a short expiration time
	return createAuthToken(payload);
}

/**
 * Creates a short-lived JWT authentication token.
 * @param payload - The data to include in the token, typically the user's ID.
 * @returns The signed JWT string.
 */
export function createAuthToken(payload: AuthTokenPayload): string {
	const authToken = sign(payload, JWT_SECRET, {
		expiresIn: '15m', // Set a short expiration time (e.g., 15 minutes)
	});

	return authToken;
}
