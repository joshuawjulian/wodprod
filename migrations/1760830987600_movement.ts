import type { Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema
		.createTable('movement')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar(255)', (col) => col.notNull())
		.addColumn('standards', 'text')
		.execute();

	await db.schema
		.createTable('movement_movement_pattern')
		.addColumn('movement_id', 'integer', (col) => col.notNull().references('movement.id'))
		.addColumn('movement_pattern_id', 'integer', (col) =>
			col.notNull().references('movement_pattern.id')
		)
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.dropTable('movement_movement_pattern').execute();
	await db.schema.dropTable('movement').execute();
}
