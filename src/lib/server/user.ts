import type { Insertable, Kysely, Selectable } from 'kysely';
import type { DB, User } from 'kysely-codegen';
import { hashPassword } from './utils';

export async function createUser(
	db: Kysely<DB>,
	email: string,
	password: string
): Promise<Selectable<User> | null> {
	try {
		let user: Insertable<User> = {
			email,
			password_hash: await hashPassword(password)
		};
		return await createUserFromUser(db, user);
	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function createUserFromUser(
	db: Kysely<DB>,
	user: Insertable<User>
): Promise<Selectable<User>> {
	const insertedUser = await db
		.with('new_user', (eb) => eb.insertInto('user').values(user).returningAll())
		.with('new_role', (eb) =>
			eb
				.insertInto('user_website_role')
				.columns(['user_id', 'website_role_id'])
				.expression((eb) =>
					eb
						.selectFrom('new_user')
						.innerJoin('website_role', (join) => join.on('website_role.name', '=', 'user'))
						.select(['new_user.id', 'website_role.id'])
				)
		)
		.selectFrom('new_user')
		.selectAll()
		.executeTakeFirstOrThrow();

	return insertedUser;
}

export async function getUserByEmail(
	db: Kysely<DB>,
	email: string
): Promise<Selectable<User> | null> {
	const selectedUser = await db
		.selectFrom('user')
		.selectAll()
		.where('email', '=', email)
		.executeTakeFirstOrThrow();

	if (selectedUser) return selectedUser;
	else return null;
}
