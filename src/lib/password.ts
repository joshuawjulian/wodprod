import bcrypt from 'bcrypt';

/**
 * Hash a password using bcrypt.
 * @param password - The password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 10; // You can adjust the cost factor as needed
	return bcrypt.hash(password, saltRounds);
}
/**
 * Compare a plaintext password with a hashed password.
 * @param password - The plaintext password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export async function comparePasswords(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword);
}
