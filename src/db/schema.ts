import {
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	unique,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	hashedPassword: text('password').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const tokens = pgTable('tokens', {
	id: serial('id').primaryKey(),
	userId: serial('user_id')
		.notNull()
		.references(() => users.id),
	authToken: text('authToken').notNull().unique(),
	authTokenCreatedAt: timestamp('auth_token_created_at').notNull().defaultNow(),
	authTokenExpiresAt: timestamp('auth_token_expires_at').notNull(),
	refreshToken: text('refreshToken').notNull().unique(),
	refreshTokenCreatedAt: timestamp('refresh_token_created_at')
		.notNull()
		.defaultNow(),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at').notNull(),
});

export const gyms = pgTable('gyms', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const gymMembership = pgEnum('gym_membership', [
	'owner',
	'coach',
	'member',
]);

export const gymMembers = pgTable(
	'gym_members',
	{
		id: serial('id').primaryKey(),
		gymId: serial('gym_id')
			.notNull()
			.references(() => gyms.id),
		userId: serial('user_id')
			.notNull()
			.references(() => users.id),
		membership: gymMembership('membership').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(t) => [unique().on(t.gymId, t.userId)],
);

export const websiteLevel = pgEnum('website_level', [
	'user',
	'editor',
	'admin',
]);

export const websiteLevels = pgTable(
	'website_levels',
	{
		id: serial('id').primaryKey(),
		userId: serial('user_id')
			.references(() => users.id)
			.notNull(),
		level: websiteLevel('level').notNull().default('user'),
	},
	(t) => [unique().on(t.userId)],
);
