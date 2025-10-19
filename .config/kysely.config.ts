import { PostgresDialect } from 'kysely';
import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg'; // Ass

export default defineConfig({
	dialect: new PostgresDialect({
		pool: new Pool({
			host: 'postgres_db',
			database: process.env.POSTGRES_DB,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			port: 5432
		})
	}),
	destroyOnExit: true // Optional, can be omitted if default is desired
});
