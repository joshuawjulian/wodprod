import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/schema';
// 1. Import Schema Only
import { envSchema } from '$lib/server/env/env-schema';

// 2. Parse manually (or just access Bun.env if you are lazy, but parsing is safer)
const env = envSchema.parse(Bun.env);

export const db = drizzle({
	connection: env.DATABASE_URL!,
	casing: 'snake_case',
	schema
});
