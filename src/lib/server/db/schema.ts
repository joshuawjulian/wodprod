import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	date,
	integer,
	pgTable,
	unique,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: varchar({ length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	websiteRoleId: integer()
		.notNull()
		.references(() => websiteRolesTable.id),
	createdAt: date('created_at').notNull().defaultNow(),
	updatedAt: date('updated_at').notNull().defaultNow()
});

export const refreshTokensTable = pgTable(
	'refresh_tokens',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		userId: integer()
			.notNull()
			.references(() => usersTable.id),
		token: varchar().notNull(),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: date('created_at').notNull().defaultNow(),
		expiresAt: date('expires_at').notNull()
	},
	(t) => [
		uniqueIndex('one_active_refresh_token_per_user')
			.on(t.userId)
			.where(sql`${t.isActive} = true`)
	]
);

export const refreshTokensRelations = relations(
	refreshTokensTable,
	({ one }) => ({
		user: one(usersTable, {
			fields: [refreshTokensTable.userId],
			references: [usersTable.id]
		})
	})
);

export const usersRelations = relations(usersTable, ({ one, many }) => ({
	websiteRole: one(websiteRolesTable, {
		fields: [usersTable.websiteRoleId],
		references: [websiteRolesTable.id]
	}),
	refreshTokens: many(refreshTokensTable)
}));

export const websiteRolesTable = pgTable('website_roles', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique()
});

export const websiteRolesRelations = relations(
	websiteRolesTable,
	({ many }) => ({
		users: many(usersTable)
	})
);

export const movementPatternsTable = pgTable('movement_patterns', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique(),
	description: varchar({ length: 500 })
});

export const movementPatternsRelations = relations(
	movementPatternsTable,
	({ many }) => ({
		movementPatterns: many(movementsMovementPatternsTable)
	})
);

export const movementsTable = pgTable('movements', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 100 }).notNull().unique(),
	videoUrl: varchar('video_url', { length: 255 }).notNull().unique(),
	standards: varchar({ length: 1000 }).notNull()
});

export const movementsRelations = relations(movementsTable, ({ many }) => ({
	movementPatterns: many(movementsMovementPatternsTable)
}));

export const movementsMovementPatternsTable = pgTable(
	'movements_movement_patterns',
	{
		movementId: integer('movement_id')
			.notNull()
			.references(() => movementsTable.id),
		movementPatternId: integer('movement_pattern_id')
			.notNull()
			.references(() => movementPatternsTable.id)
	},
	(t) => [unique().on(t.movementId, t.movementPatternId)]
);

export const movementsMovementPatternsRelations = relations(
	movementsMovementPatternsTable,
	({ one }) => ({
		movement: one(movementsTable, {
			fields: [movementsMovementPatternsTable.movementId],
			references: [movementsTable.id]
		}),
		movementPattern: one(movementPatternsTable, {
			fields: [movementsMovementPatternsTable.movementPatternId],
			references: [movementPatternsTable.id]
		})
	})
);
