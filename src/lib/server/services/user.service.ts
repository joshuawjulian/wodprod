import type { UserSelectType } from '$lib/db/schema';
import sql from '../database/client';

/**
 * Handles the complete business logic for registering a new user,
 * including creating their user record and their default role.
 * This uses the single-query approach for atomicity.
 */
export async function registerNewUser(
	email: string,
	hashedPassword_hash: string,
): Promise<UserSelectType> {
	// The raw SQL query that handles both inserts
	const [user] = await sql<UserSelectType[]>`
    WITH new_user AS (
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${hashedPassword_hash})
      RETURNING id, email, created_at
    )
    INSERT INTO website_roles (user_id, role)
    SELECT id, 'user' FROM new_user
    RETURNING (SELECT id FROM new_user), (SELECT email FROM new_user), (SELECT created_at FROM new_user);
  `;
	return user;
}
