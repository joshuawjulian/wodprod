import { text, unique, varchar } from 'drizzle-orm/pg-core';
import { createTable } from './table-creator';
import { relations } from 'drizzle-orm';

// --
// DICTIONARY TABLES
// --

export const movementPatternsTable = createTable(
	'movement_patterns',
	{
		name: varchar('name').notNull(),
		description: varchar('description').notNull()
	},
	(t) => [unique('movement_pattern_name').on(t.name)]
);

export const movementPatternsRelations = relations(movementPatternsTable, ({ many }) => ({
	movementsMovementPayttern: many(movementsMovementPatternsTable)
}));

export const movementsTable = createTable(
	'movements',
	{
		name: varchar('name').notNull(),
		standards: text('standards').notNull(),
		videoUrl: varchar('video_url')
	},
	(t) => [unique('movement_name').on(t.name)]
);

export const movementsMovementPatternsTable = createTable('movements_movement_patterns', {
	movementPatternId: text('movement_pattern_id')
		.notNull()
		.references(() => movementPatternsTable.id),
	movementId: text('movement_id')
		.notNull()
		.references(() => movementsTable.id)
});
