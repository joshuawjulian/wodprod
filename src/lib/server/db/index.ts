import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './relations';
import * as schema from './schema';
// 1. Import Schema Only
import { envSchema } from '$lib/server/env/env-schema';

// 2. Parse manually (or just access Bun.env if you are lazy, but parsing is safer)
const env = envSchema.parse(Bun.env);

export const db = drizzle(env.DATABASE_URL, {
	casing: 'snake_case',
	schema: schema,
	relations: relations
});

export function isTransaction(ctx: DbTxType): ctx is TransactionType {
	// Drizzle transactions usually don't have the 'transaction' method exposed
	// the same way the root DB does, or they handle savepoints differently.
	return !('transaction' in ctx);
}

export type DBType = typeof db;
export type TransactionType = Parameters<Parameters<DBType['transaction']>[0]>[0];
export type DbTxType = DBType | TransactionType;
