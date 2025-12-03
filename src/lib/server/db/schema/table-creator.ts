// src/lib/server/db/table-creator.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

/**
 * Custom table creator that automatically adds:
 * 1. id (UUID v7, Primary Key)
 * 2. createdAt
 * 3. updatedAt
 * @param name The SQL table name
 * @param columns The specific columns for this table
 * @param extraConfig Optional Drizzle config (indexes, checks, etc.)
 */
export const createTable = <T extends Record<string, any>>(
	name: string,
	columns: T,
	extraConfig?: (self: any) => any
) => {
	return pgTable(
		name,
		{
			// 1. Auto-Inject Standard ID
			id: text('id')
				.primaryKey()
				.$defaultFn(() => uuidv7()),

			// 2. Spread user-defined columns
			...columns,

			// 3. Auto-Inject Timestamps
			createdAt: timestamp('created_at').notNull().defaultNow(),
			updatedAt: timestamp('updated_at')
				.notNull()
				.defaultNow()
				.$onUpdate(() => new Date()) // Auto-update timestamp
		},
		extraConfig
	);
};
