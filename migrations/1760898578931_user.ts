import { sql, type Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema
		.createTable('user')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
		.addColumn('password_hash', 'varchar(255)', (col) => col.notNull())
		.addColumn('created_at', 'timestamptz', (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
		)
		.addColumn('refresh_token', 'varchar(255)', (col) => col.defaultTo(null))
		.execute();

	await db.schema.createIndex('idx_user_email').on('user').column('email').execute();

	await db.schema
		.createTable('website_role')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
		.execute();

	await db.schema
		.createTable('user_website_role')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('website_role_id', 'integer', (col) => col.references('website_role.id'))
		.addColumn('user_id', 'integer', (col) => col.references('user.id').unique())
		.execute();

	await db.schema
		.createTable('gym_role')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.dropTable('user_website_role').execute();
	await db.schema.dropTable('user').execute();
	await db.schema.dropTable('website_role').execute();
	await db.schema.dropTable('gym_role').execute();
}
