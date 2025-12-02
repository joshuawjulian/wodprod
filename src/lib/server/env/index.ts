// src/lib/server/env.ts
import { building } from '$app/environment';
import { envSchema, type EnvType } from './env-schema'; // Relative import

let envData: EnvType;

if (building) {
	envData = {
		POSTGRES_DB: 'mock',
		POSTGRES_USER: 'mock',
		POSTGRES_PASSWORD: 'mock',
		POSTGRES_HOST: 'mock',
		POSTGRES_URL: `postgresql://mock:mock@mock:5432/mock`,
		DATABASE_URL: `postgresql://mock:mock@mock:5432/mock`,
		NODE_ENV: 'development'
	};
} else {
	const parsed = envSchema.safeParse(Bun.env);
	if (!parsed.success) {
		console.error('❌ Invalid App Env:', parsed.error.flatten().fieldErrors);
		process.exit(1);
	}
	envData = parsed.data;
}

export const env = envData as import('./env-schema').EnvType;
