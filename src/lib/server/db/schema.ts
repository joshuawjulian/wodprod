import { relations } from 'drizzle-orm';
import { date, integer, pgTable, unique, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: varchar({ length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	refreshToken: varchar('refresh_token', { length: 255 }),
	createdAt: date('created_at').notNull().defaultNow(),
	updatedAt: date('updated_at').notNull().defaultNow()
});

export const websiteRolesTable = pgTable('website_roles', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique()
});

export const usersWebsiteRolesTable = pgTable(
	'users_website_roles',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		roleId: integer('role_id')
			.notNull()
			.references(() => websiteRolesTable.id, { onDelete: 'cascade' }),
		assigned_at: date().notNull().defaultNow()
	},
	(t) => [unique().on(t.userId, t.roleId)]
);

export const usersRelations = relations(usersTable, ({ many }) => ({
	usersToWebsiteRoles: many(usersWebsiteRolesTable)
}));

export const websiteRolesRelations = relations(
	websiteRolesTable,
	({ many }) => ({
		usersToWebsiteRoles: many(usersWebsiteRolesTable)
	})
);

export const usersWebsiteRolesRelations = relations(
	usersWebsiteRolesTable,
	({ one }) => ({
		user: one(usersTable, {
			fields: [usersWebsiteRolesTable.userId],
			references: [usersTable.id]
		}),
		role: one(websiteRolesTable, {
			fields: [usersWebsiteRolesTable.roleId],
			references: [websiteRolesTable.id]
		})
	})
);

export const movementPatternsTable = pgTable('movement_patterns', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique(),
	description: varchar({ length: 500 })
});

export const movementsTable = pgTable('movements', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique(),
	videoUrl: varchar('video_url', { length: 255 }).notNull().unique(),
	standards: varchar({ length: 1000 }).notNull()
});

export const movementsMovementPatternsTable = pgTable(
	'movements_movement_patterns',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		movementId: integer('movement_id')
			.notNull()
			.references(() => movementsTable.id),
		movementPatternId: integer('movement_pattern_id')
			.notNull()
			.references(() => movementPatternsTable.id)
	}
);
