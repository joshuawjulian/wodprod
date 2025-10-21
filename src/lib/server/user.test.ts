import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import type { ControlledTransaction, Insertable } from 'kysely';
import type { DB, User } from 'kysely-codegen';
import { db } from './database'; // <-- Import your REAL database instance
import { createUser, createUserFromUser } from './user';
import { verifyPassword } from './utils';

// A variable to hold the transaction object for each test
let trx: ControlledTransaction<DB>;

describe('createUser with transactional testing', () => {
	// Before each test, begin a new transaction
	beforeEach(async () => {
		trx = await db.startTransaction().execute();
	});

	// After each test, roll back the transaction
	afterEach(async () => {
		if (trx) {
			await trx.rollback().execute();
		}
	});

	it('should create a user from email and password and assign a role', async () => {
		let email = 'test@test.com';
		let password = 'test';

		const userWebsiteRole = await trx
			.selectFrom('website_role')
			.where('name', '=', 'user')
			.selectAll()
			.executeTakeFirst();

		const createdUser = await createUser(trx, email, password);

		expect(createdUser).toBeObject();

		if (createdUser === null) {
			expect(true).toBe(false); // want test to fail if we return early
			return false;
		}

		expect(createdUser.email).toBe('test@test.com');

		const roleAssignment = await trx // <-- Query using the same transaction
			.selectFrom('user_website_role')
			.selectAll()
			.where('user_id', '=', createdUser.id)
			.executeTakeFirst();

		expect(roleAssignment).toBeObject();
		expect(roleAssignment?.website_role_id).toBe(userWebsiteRole?.id);

		expect(await verifyPassword(createdUser.password_hash, 'test')).toBe(true);
	});

	it('should create a user and assign a role within a transaction', async () => {
		// 1. ARRANGE
		// Seed any prerequisite data *within the transaction*
		const userWebsiteRole = await trx
			.selectFrom('website_role')
			.where('name', '=', 'user')
			.selectAll()
			.executeTakeFirst();

		const newUser: Insertable<User> = {
			email: 'jane.doe@example.com',
			password_hash: 'hash'
		};

		// 2. ACT
		// Pass the transaction object `trx` to the function
		const createdUser = await createUserFromUser(trx, newUser);

		// 3. ASSERT
		expect(createdUser.email).toBe('jane.doe@example.com');

		const roleAssignment = await trx // <-- Query using the same transaction
			.selectFrom('user_website_role')
			.selectAll()
			.where('user_id', '=', createdUser.id)
			.executeTakeFirst();

		expect(roleAssignment).toBeObject();
		expect(roleAssignment?.website_role_id).toBe(userWebsiteRole?.id);
	});
});
