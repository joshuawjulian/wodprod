import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
// You can specify any property from the bun sql connection options
export const db = drizzle({
	connection: process.env.DATABASE_URL || '',
	casing: 'snake_case'
});
