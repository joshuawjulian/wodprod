import { text, unique, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './auth-schema';
import { createTable } from './table-creator';

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

export const movementsTable = createTable(
	'movements',
	{
		name: varchar('name').notNull(),
		standards: text('standards').notNull(),
		videoUrl: varchar('video_url')
	},
	(t) => [unique('movement_name').on(t.name)]
);

export const websiteRolesTable = createTable('website_roles', {
	name: varchar('name').notNull()
});

export const gymRolesTable = createTable('gym_roles', {
	name: varchar('name').notNull()
});

// --
// Join tables --
// --
export const movementsToMovementPatternsTable = createTable('movements_to_movement_patterns', {
	movementPatternId: text('movement_pattern_id')
		.notNull()
		.references(() => movementPatternsTable.id),
	movementId: text('movement_id')
		.notNull()
		.references(() => movementsTable.id)
});

export const usersToWebsiteRolesTable = createTable('users_to_website_roles', {
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	websiteRoleId: text('website_role_id')
		.notNull()
		.references(() => websiteRolesTable.id)
});

// --
// application tables
//

export const gymsTable = createTable('gyms', {
	name: varchar('name').notNull(),
	ownerId: text('owner_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' })
});
