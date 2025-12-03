import { envSchema } from './env-schema';

const parsed = envSchema.safeParse(Bun.env);

if (!parsed.success) {
	console.error('❌ CLI Env Error:', parsed.error.flatten().fieldErrors);
	process.exit(1);
}

export const env = parsed.data;
