import {
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	unique,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import * as z from 'zod';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	hashedPassword: text('password').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const userSelectSchema = createSelectSchema(users, {
	email: z.email(),
});
export type UserSelectType = z.infer<typeof userSelectSchema>;
export const userInsertSchema = createInsertSchema(users);
export type UserInsertType = z.infer<typeof userInsertSchema>;
export const userUpdateSchema = createInsertSchema(users);

export const sessions = pgTable('sessions', {
	id: serial('id').primaryKey(),
	userId: serial('user_id')
		.notNull()
		.references(() => users.id),
	refreshTokenHash: text('refresh_token_hash').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	isActive: text('is_active').notNull().default('true'),
});

export const sessionSelectSchema = createSelectSchema(sessions);
export type SessionSelectType = z.infer<typeof sessionSelectSchema>;
export const sessionInsertSchema = createInsertSchema(sessions);
export type SessionInsertType = z.infer<typeof sessionInsertSchema>;

export const gyms = pgTable('gyms', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const gymRole = pgEnum('gym_role', ['owner', 'coach', 'member']);
export const gymRoleSchema = z.enum(['owner', 'coach', 'member']);
export type GymRoleType = z.infer<typeof gymRoleSchema>;

export const gymRoles = pgTable(
	'gym_members',
	{
		id: serial('id').primaryKey(),
		gymId: serial('gym_id')
			.notNull()
			.references(() => gyms.id),
		userId: serial('user_id')
			.notNull()
			.references(() => users.id),
		role: gymRole('role').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(t) => [unique().on(t.gymId, t.userId)],
);

export const gymRoleSelectSchema = createSelectSchema(gymRoles);
export const gymRoleAuthSchema = z.object({
	gymId: z.number(),
	role: gymRoleSchema,
});
export type GymRoleAuthType = z.infer<typeof gymRoleAuthSchema>;

export const websiteRole = pgEnum('website_role', ['user', 'editor', 'admin']);
export const websiteRoleSchema = z.enum(['user', 'editor', 'admin']);
export type WebsiteRoleType = z.infer<typeof websiteRoleSchema>;

export const websiteRoles = pgTable(
	'website_roles',
	{
		id: serial('id').primaryKey(),
		userId: serial('user_id')
			.references(() => users.id)
			.notNull(),
		role: websiteRole('role').notNull().default('user'),
	},
	(t) => [unique().on(t.userId)],
);
