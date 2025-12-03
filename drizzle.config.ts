// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { envSchema } from './src/lib/server/env/env-schema'; // Import Schema only

// Validate CLI environment immediately
const parsed = envSchema.safeParse(Bun.env);

if (!parsed.success) {
	console.error('❌ Invalid CLI Env:', parsed.error.flatten().fieldErrors);
	process.exit(1);
}

const env = parsed.data;

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts', // Adjust to your schema path
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL
	}
});
