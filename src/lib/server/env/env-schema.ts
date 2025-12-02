// src/lib/server/env-schema.ts
import { z } from 'zod';

export const envSchema = z.object({
	// Validators
	POSTGRES_USER: z.string().min(1),
	POSTGRES_DB: z.string().min(1),
	POSTGRES_PASSWORD: z.string().min(1),
	POSTGRES_HOST: z.string().min(1),
	POSTGRES_URL: z.string().min(1),
	DATABASE_URL: z.url(),

	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

	BETTER_AUTH_SECRET: z.string().min(32),
	BETTER_AUTH_URL: z.url()
});

export type EnvType = z.infer<typeof envSchema>;
