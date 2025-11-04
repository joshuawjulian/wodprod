import { date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: varchar({ length: 255 }).notNull().unique(),
	password_hash: varchar({ length: 255 }).notNull(),
	refresh_token: varchar({ length: 255 }),
	created_at: date().notNull().defaultNow(),
	updated_at: date().notNull().defaultNow()
});

export const websiteRolesTable = pgTable('website_roles', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique()
});

export const usersWebsiteRolesTable = pgTable('user_website_roles', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	user_id: integer()
		.notNull()
		.references(() => usersTable.id),
	role_id: integer()
		.notNull()
		.references(() => websiteRolesTable.id),
	assigned_at: date().notNull().defaultNow()
});

export const movementPatternsTable = pgTable('movement_patterns', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique(),
	description: varchar({ length: 500 })
});

export const movementsTable = pgTable('movements', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique(),
	video_url: varchar({ length: 255 }).notNull().unique(),
	standards: varchar({ length: 1000 }).notNull()
});

export const movementsMovementPatternsTable = pgTable(
	'movements_movement_patterns',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		movement_id: integer()
			.notNull()
			.references(() => movementsTable.id),
		movement_pattern_id: integer()
			.notNull()
			.references(() => movementPatternsTable.id)
	}
);
