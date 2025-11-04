import { describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '../auth/utils';
import { db } from './';
import { usersTable } from './schema';
import { registerUser } from './users';

describe('User Queries', () => {
	it('should create a user and assign a role, then roll back', async () => {
		await db.transaction(async (tx) => {
			// <-- 'tx' is of type DbClient

			// Now this works perfectly!
			const result = await registerUser(tx, 'test@email.com', 'test');
			expect(result.err).toBeFalse();
			expect(result.ok).toBeTrue();
			expect(result.val).toBeDefined();

			const userResult = await tx
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, 'test@email.com'));

			expect(userResult).toHaveLength(1);
			expect(userResult[0].email).toBe('test@email.com');

			console.log(userResult);

			const passwordCheckResult = await verifyPassword(
				userResult[0].passwordHash,
				'test'
			);

			expect(passwordCheckResult.ok).toBeTrue();

			const passwordCheck = passwordCheckResult.val;

			expect(passwordCheck).toBeTypeOf('boolean');
			try {
				await tx.rollback();
			} catch (e) {}
		});
	});
});
