import type { Kysely } from 'kysely';
import type { DB } from 'kysely-codegen';

// replace `any` with your database interface.
export async function seed(db: Kysely<DB>): Promise<void> {
	// seed code goes here...
	// note: this function is mandatory. you must implement this function.

	await db
		.insertInto('website_role')
		.values([
			{
				name: 'owner'
			},
			{
				name: 'super'
			},
			{
				name: 'user'
			}
		])
		.execute();
}
