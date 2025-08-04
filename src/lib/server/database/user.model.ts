import type { UserSelectType } from '$lib/db/schema';
import * as bcrypt from 'bcrypt';
import sql from './client';

export async function insertUser(
	email: string,
	plainPassword: string,
): Promise<UserSelectType> {
	const hashedPassword = await bcrypt.hash(plainPassword, 10);
	const [user] = await sql<UserSelectType[]>`
    INSERT INTO users (email, hashed_password)
    VALUES (${email}, ${hashedPassword})
    RETURNING id, email;
  `;
	return user;
}

export async function getUserByEmail(
	email: string,
): Promise<UserSelectType | null> {
	const [user] = await sql<UserSelectType[]>`
    SELECT id, email
    FROM users
    WHERE email = ${email}
  `;
	return user || null;
}

export async function getUserById(id: number): Promise<UserSelectType | null> {
	const [user] = await sql<UserSelectType[]>`
    SELECT id, email
    FROM users
    WHERE id = ${id}
  `;
	return user || null;
}

export async function validateUserCredentials(
	email: string,
	plainPassword: string,
): Promise<UserSelectType | null> {
	const user = await getUserByEmail(email);
	if (!user) return null;

	const isValid = await bcrypt.compare(plainPassword, user.hashedPassword);
	return isValid ? user : null;
}
