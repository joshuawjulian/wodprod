// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { env } from './src/lib/server/env/cli';

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts', // Adjust to your schema path
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL
	}
});
