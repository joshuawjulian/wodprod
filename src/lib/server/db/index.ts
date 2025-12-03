import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/schema';

export const db = drizzle({
	connection: Bun.env.DATABASE_URL!,
	casing: 'snake_case',
	schema
});
