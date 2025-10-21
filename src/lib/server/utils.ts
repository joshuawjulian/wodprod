import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
	try {
		const hash = await argon2.hash(password);
		return hash;
	} catch (err) {
		// Handle error
		throw err;
	}
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
	try {
		const match = await argon2.verify(hash, password);
		return match;
	} catch (err) {
		// Handle error
		throw err;
	}
}
