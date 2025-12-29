import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	varchar,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { usersTable } from './auth-schema';

const uuidColumn = {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => uuidv7())
};

const timestamps = {
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at')
};

// --
// DICTIONARY TABLES
// --

export const movementPatternsTable = pgTable(
	'movement_patterns',
	{
		...uuidColumn,
		name: varchar('name').notNull(),
		description: varchar('description').notNull(),
		...timestamps
	},
	(t) => [
		unique('movement_pattern_name').on(t.name),
		index('movement_patterns_deleted_at_idx').on(t.deletedAt)
	]
);

export const modalitiesTable = pgTable(
	'modalities',
	{
		...uuidColumn,
		code: varchar('code', { length: 1 }).notNull(),
		name: varchar('name').notNull(),
		intent: varchar('intent').notNull(),
		...timestamps
	},
	(t) => [unique('modality_code').on(t.code), index('modalities_deleted_at_idx').on(t.deletedAt)]
);

export const movementsTable = pgTable(
	'movements',
	{
		...uuidColumn,
		name: varchar('name').notNull(),
		standards: text('standards').notNull(),
		videoUrl: varchar('video_url'),
		modalityId: text('modality_id')
			.notNull()
			.references(() => modalitiesTable.id),
		parentMovementId: text('parent_movement_id').references((): AnyPgColumn => movementsTable.id),
		...timestamps
	},
	(t) => [
		unique('movement_name').on(t.name),
		index('movements_deleted_at_idx').on(t.deletedAt),
		index('movements_modality_id_idx').on(t.modalityId),
		index('movements_parent_movement_id_idx').on(t.parentMovementId)
	]
);

export const gymRolesTable = pgTable(
	'gym_roles',
	{
		...uuidColumn,
		name: varchar('name').notNull(),
		description: varchar('description').notNull(),
		...timestamps
	},
	(t) => [index('gym_roles_deleted_at_idx').on(t.deletedAt)]
);

export const equipmentTable = pgTable(
	'equipment',
	{
		...uuidColumn,
		name: varchar('name').notNull(),
		description: varchar('description').notNull(),
		...timestamps
	},
	(t) => [index('equipment_deleted_at_idx').on(t.deletedAt)]
);

// --
// Join tables --
// --
export const dominanceEnum = pgEnum('dominance', ['Primary', 'Secondary']);

export const movementsToMovementPatternsTable = pgTable(
	'movements_to_movement_patterns',
	{
		...uuidColumn,
		movementPatternId: text('movement_pattern_id')
			.notNull()
			.references(() => movementPatternsTable.id),
		movementId: text('movement_id')
			.notNull()
			.references(() => movementsTable.id),
		dominance: dominanceEnum('dominance').notNull().default('Primary'),
		...timestamps
	},
	(t) => [
		index('movements_to_patterns_deleted_at_idx').on(t.deletedAt),
		index('movements_to_patterns_movement_id_idx').on(t.movementId),
		index('movements_to_patterns_pattern_id_idx').on(t.movementPatternId),
		// Composite index for efficient lookups in both directions
		index('movements_to_patterns_composite_idx').on(t.movementId, t.movementPatternId)
	]
);

export const equipmentToMovementsTable = pgTable(
	'equipment_to_movements',
	{
		...uuidColumn,
		equipmentId: text('equipment_id')
			.notNull()
			.references(() => equipmentTable.id),
		movementId: text('movement_id')
			.notNull()
			.references(() => movementsTable.id),
		...timestamps
	},
	(t) => [
		index('equipment_to_movements_deleted_at_idx').on(t.deletedAt),
		index('equipment_to_movements_equipment_id_idx').on(t.equipmentId),
		index('equipment_to_movements_movement_id_idx').on(t.movementId),
		// Composite index for efficient lookups in both directions
		index('equipment_to_movements_composite_idx').on(t.equipmentId, t.movementId)
	]
);
// --
// application tables
//

export const gymsTable = pgTable(
	'gyms',
	{
		...uuidColumn,
		name: varchar('name').notNull(),
		ownerId: text('owner_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(t) => [index('gyms_deleted_at_idx').on(t.deletedAt), index('gyms_owner_id_idx').on(t.ownerId)]
);
