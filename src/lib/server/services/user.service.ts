import type { UserSelectType } from '$lib/db/schema';
import { hash, verify } from 'argon2';
import sql from '../database/client';

/**
 * Handles the complete business logic for registering a new user,
 * including creating their user record and their default role.
 * This uses the single-query approach for atomicity.
 */
export async function registerUser(
	email: string,
	password: string,
): Promise<UserSelectType> {
	const hashedPassword = await hash(password);
	// The raw SQL query that handles both inserts
	const [user] = await sql<UserSelectType[]>`
    WITH new_user AS (
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${hashedPassword})
      RETURNING id, email, created_at
    )
    INSERT INTO website_roles (user_id, role)
    SELECT id, 'user' FROM new_user
    RETURNING (SELECT id FROM new_user), (SELECT email FROM new_user), (SELECT created_at FROM new_user);
  `;
	return user;
}

export async function findUserByEmail(
	email: string,
): Promise<UserSelectType | null> {
	const [user] = await sql<UserSelectType[]>`
    SELECT id, email, created_at
    FROM users
    WHERE email = ${email}
  `;
	return user || null;
}

export async function verifyUserCredentials(
	email: string,
	password: string,
): Promise<UserSelectType | null> {
	const user = await findUserByEmail(email);
	if (!user) {
		return null;
	}

	const isPasswordValid = await verify(user.hashedPassword, password);
	if (!isPasswordValid) {
		return null;
	}

	return user;
}
