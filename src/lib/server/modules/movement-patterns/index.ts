import type { DbTxType } from '$lib/server/db';
import type {
	MovementPatternType,
	MovementPatternFormType,
	MovementPatternUpdateType
} from '$lib/types';
import { Result, err, ok } from 'neverthrow';
import { movementPatternsTable } from '$lib/server/db/schema/schema';
import { eq, isNull } from 'drizzle-orm';

export const getAllMovementPatterns = async (
	tx: DbTxType
): Promise<Result<MovementPatternType[], Error>> => {
	try {
		const patterns = await tx
			.select()
			.from(movementPatternsTable)
			.where(isNull(movementPatternsTable.deletedAt));
		return ok(patterns);
	} catch (e) {
		return err(new Error('Failed to fetch movement patterns'));
	}
};

export const createMovementPattern = async (
	tx: DbTxType,
	data: MovementPatternFormType
): Promise<Result<MovementPatternType, Error>> => {
	try {
		const [pattern] = await tx
			.insert(movementPatternsTable)
			.values(data)
			.returning();
		return ok(pattern);
	} catch (e) {
		return err(new Error('Failed to create movement pattern'));
	}
};

export const updateMovementPattern = async (
	tx: DbTxType,
	data: MovementPatternUpdateType
): Promise<Result<MovementPatternType, Error>> => {
	try {
		const [pattern] = await tx
			.update(movementPatternsTable)
			.set(data)
			.where(eq(movementPatternsTable.id, data.id))
			.returning();

		if (!pattern) {
			return err(new Error('Movement pattern not found'));
		}

		return ok(pattern);
	} catch (e) {
		return err(new Error('Failed to update movement pattern'));
	}
};

export const deleteMovementPattern = async (
	tx: DbTxType,
	id: string
): Promise<Result<void, Error>> => {
	try {
		// Soft delete
		await tx
			.update(movementPatternsTable)
			.set({ deletedAt: new Date() })
			.where(eq(movementPatternsTable.id, id));

		return ok(undefined);
	} catch (e) {
		return err(new Error('Failed to delete movement pattern'));
	}
};
