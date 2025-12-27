import { db } from '$lib/server/db';
import { restoreSoftDelete, softDelete } from '$lib/server/db/helpers/soft-delete';
import { movementsTable, movementsToMovementPatternsTable } from '$lib/server/db/schema';
import { err, ok, type Result } from 'neverthrow';
import z from 'zod';

export const insertMovement = async (
	name: string,
	standards: string,
	videoUrl: string,
	modalityId: string,
	movementPatternsIds: string[]
): Promise<Result<boolean, string>> => {
	const movementPatternsIdsParse = z.array(z.string()).safeParse(movementPatternsIds);
	if (movementPatternsIdsParse.error) return err(movementPatternsIdsParse.error.message);

	db.transaction(async (tx) => {
		const movement = await tx
			.insert(movementsTable)
			.values({
				name,
				standards,
				videoUrl,
				modalityId
			})
			.returning({ id: movementsTable.id })
			.then((res) => res[0]);

		// Insert into join table
		for (const patternId of movementPatternsIdsParse.data) {
			await tx.insert(movementsToMovementPatternsTable).values({
				movementId: movement.id,
				movementPatternId: patternId
			});
		}
	});

	return ok(true);
};

/**
 * Get all active movements (excludes soft deleted)
 */
export const getActiveMovements = async (): Promise<
	Result<(typeof movementsTable.$inferSelect)[], string>
> => {
	try {
		const movements = await db.query.movementsTable.findMany({
			where: {
				deletedAt: {
					isNull: true
				}
			}
		});

		return ok(movements);
	} catch (error) {
		return err(`Failed to fetch movements: ${error}`);
	}
};

/**
 * Get active movements for a specific modality
 */
export const getActiveMovementsByModality = async (
	modalityId: string
): Promise<Result<(typeof movementsTable.$inferSelect)[], string>> => {
	try {
		const movements = await db.query.movementsTable.findMany({
			where: {
				deletedAt: {
					isNull: true
				},
				modalityId: modalityId
			}
		});

		return ok(movements);
	} catch (error) {
		return err(`Failed to fetch movements: ${error}`);
	}
};

/**
 * Soft delete a movement
 */
export const deleteMovement = async (
	movementId: string
): Promise<Result<typeof movementsTable.$inferSelect, string>> => {
	try {
		const deleted = await softDelete(movementsTable, movementId);

		if (!deleted) {
			return err('Movement not found');
		}

		return ok(deleted);
	} catch (error) {
		return err(`Failed to delete movement: ${error}`);
	}
};

/**
 * Restore a soft deleted movement
 */
export const restoreMovement = async (
	movementId: string
): Promise<Result<typeof movementsTable.$inferSelect, string>> => {
	try {
		const restored = await restoreSoftDelete(movementsTable, movementId);

		if (!restored) {
			return err('Movement not found');
		}

		return ok(restored);
	} catch (error) {
		return err(`Failed to restore movement: ${error}`);
	}
};

/**
 * Get movements with relations
 */
export const getMovementsWithRelations = async () => {
	try {
		const movements = await db.query.movementsTable.findMany({
			where: {
				deletedAt: {
					isNull: true
				}
			},
			with: {
				modality: true,
				movementPatterns: true,
				equipment: true
			}
		});

		return ok(movements);
	} catch (error) {
		return err(`Failed to fetch movements with relations: ${error}`);
	}
};

/**
 * Get movements by modality with relations
 */
export const getMovementsByModality = async (modalityId: string) => {
	try {
		const movements = await db.query.movementsTable.findMany({
			where: {
				deletedAt: {
					isNull: true
				},
				modalityId: modalityId
			},
			with: {
				modality: true,
				movementPatterns: true,
				equipment: true
			}
		});

		return ok(movements);
	} catch (error) {
		return err(`Failed to fetch movements: ${error}`);
	}
};
