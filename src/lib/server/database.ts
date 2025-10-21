import 'dotenv/config';
import { Kysely, PostgresDialect } from 'kysely';
import { type DB } from 'kysely-codegen'; // this is the Database interface we defined earlier
import { Pool } from 'pg';

export const dialect = new PostgresDialect({
	pool: new Pool({
		host: process.env.POSTGRES_HOST,
		database: process.env.POSTGRES_DB,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		port: 5432,
		max: 10
	})
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
	dialect
});
