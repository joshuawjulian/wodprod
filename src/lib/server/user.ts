import type { Insertable, Kysely } from 'kysely';
import type { DB, User } from 'kysely-codegen';

export async function createUser(db: Kysely<DB>, user: Insertable<User>) {
	try {
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
	} catch (err) {
		console.log('----------------');
		console.error(err);
		throw err;
	}
}
