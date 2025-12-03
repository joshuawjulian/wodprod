import { integer, pgTable, unique, varchar } from 'drizzle-orm/pg-core';

// --
// DICTIONARY TABLES
// --

export const movementPatternsTable = pgTable(
	'movement_patterns',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		name: varchar('name').notNull(),
		description: varchar('description').notNull()
	},
	(t) => [unique('mp_name').on(t.name)]
);
