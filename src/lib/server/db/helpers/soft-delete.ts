import { db } from '$lib/server/db';
import { and, eq, isNotNull, isNull, SQL } from 'drizzle-orm';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';

// Type for tables that support soft delete
type SoftDeletableTable = PgTable & {
	id: PgColumn;
	deletedAt: PgColumn;
};

/**
 * Soft delete a record by setting deletedAt to current timestamp
 * @param table - The Drizzle table to delete from
 * @param id - The ID of the record to soft delete
 * @returns The soft deleted record
 */
export async function softDelete<T extends SoftDeletableTable>(table: T, id: string) {
	const result = await db
		.update(table)
		.set({ deletedAt: new Date() } as any)
		.where(eq(table.id, id) as any)
		.returning();

	return result[0];
}

/**
 * Restore a soft deleted record by setting deletedAt to null
 * @param table - The Drizzle table to restore in
 * @param id - The ID of the record to restore
 * @returns The restored record
 */
export async function restoreSoftDelete<T extends SoftDeletableTable>(table: T, id: string) {
	const result = await db
		.update(table)
		.set({ deletedAt: null } as any)
		.where(eq(table.id, id) as any)
		.returning();

	return result[0];
}

/**
 * Helper to filter out soft deleted records in queries
 * Use this in your where clauses to automatically exclude deleted records
 * @returns SQL condition to filter out deleted records
 */
export function notDeleted<T extends SoftDeletableTable>(table: T): SQL {
	return isNull(table.deletedAt as any);
}

/**
 * Helper to filter for only soft deleted records
 * @returns SQL condition to filter for deleted records
 */
export function onlyDeleted<T extends SoftDeletableTable>(table: T): SQL {
	return isNotNull(table.deletedAt as any);
}

/**
 * Query builder helpers that automatically exclude soft deleted records
 * Use these with the SQL-like API (db.select().from().where())
 */
export const withSoftDelete = {
	/**
	 * Wraps a where condition to automatically exclude soft deleted records
	 * @param table - The table to query
	 * @param condition - Additional where conditions (optional)
	 * @returns Combined SQL condition
	 */
	where<T extends SoftDeletableTable>(table: T, condition?: SQL) {
		return condition ? and(notDeleted(table), condition) : notDeleted(table);
	},

	/**
	 * Wraps a where condition to include only soft deleted records
	 * @param table - The table to query
	 * @param condition - Additional where conditions (optional)
	 * @returns Combined SQL condition
	 */
	whereDeleted<T extends SoftDeletableTable>(table: T, condition?: SQL) {
		return condition ? and(onlyDeleted(table), condition) : onlyDeleted(table);
	}
};

