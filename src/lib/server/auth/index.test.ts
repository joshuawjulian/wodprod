import { describe, expect, it } from 'bun:test';
import { getUserAuthPayloadByEmail } from '.';
import { db } from '../db';
import { registerUser } from '../db/users';

describe('User Queries', () => {
	it('should create a user and assign a role, then roll back', async () => {
		db.transaction(async (tx) => {
			const testEmail = 'test@email.com';
			const testPasswordRaw = 'test';
			const result = await registerUser(tx, testEmail, testPasswordRaw);
			expect(result.err).toBeFalse();
			expect(result.ok).toBeTrue();
			expect(result.val).toBeDefined();

			const userResult = await getUserAuthPayloadByEmail(tx, testEmail);
			console.log(userResult);

			await tx.rollback();
		});
	});
});
