import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
// You can specify any property from the bun sql connection options
export const client = new SQL(Bun.env.DATABASE_URL!);
export const db = drizzle({
	client,
	casing: 'snake_case'
});

export type DBType = typeof db;
export type TransactionType = Parameters<
	Parameters<typeof db.transaction>[0]
>[0];

export type DBTRXType = DBType | TransactionType;
