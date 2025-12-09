import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		users: await db.select().from(usersTable)
	};
};
