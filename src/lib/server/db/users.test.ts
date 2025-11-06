import { describe, expect, it } from 'bun:test';
import { db } from './';
import { getUserByEmail, registerUser } from './users';

describe('User Queries', () => {
	it('should create a user and assign a role, then roll back', async () => {
		db.transaction(async (tx) => {
			const testEmail = 'test@email.com';
			const testPasswordRaw = 'test';
			const result = await registerUser(tx, testEmail, testPasswordRaw);
			expect(result.err).toBeFalse();
			expect(result.ok).toBeTrue();
			expect(result.val).toBeDefined();

			const userResult = await getUserByEmail(tx, testEmail);
			if (userResult.err) throw new Error('userResult.err === true');
			const user = userResult.val;
			expect(user.email).toBe(testEmail);

			await tx.rollback();
		});
	});
});
