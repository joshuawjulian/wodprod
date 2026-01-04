import type { DbTxType } from '$lib/server/db';
import type {
	MovementType,
	MovementFormType,
	MovementUpdateType,
	MovementWithRelationsType
} from '$lib/types';
import { Result, err, ok } from 'neverthrow';
import {
	equipmentToMovementsTable,
	movementsTable,
	movementsToMovementPatternsTable
} from '$lib/server/db/schema/schema';
import { eq, isNull } from 'drizzle-orm';

/**
 * Get all movements with relations (modality, patterns with dominance, equipment)
 */
export const getAllMovements = async (
	tx: DbTxType
): Promise<Result<MovementWithRelationsType[], Error>> => {
	try {
		const movements = await tx.query.movementsTable.findMany({
			where: (movements, { isNull }) => isNull(movements.deletedAt),
			with: {
				modality: true,
				movementPatterns: {
					with: {
						movementPattern: true
					}
				},
				equipment: true
			}
		});

		// Transform the data to match our type structure
		// The junction table includes both the pattern and the dominance
		const transformedMovements = movements.map((movement: any) => ({
			...movement,
			patterns: movement.movementPatterns?.map((mp: any) => ({
				...mp.movementPattern,
				dominance: mp.dominance
			})) ?? [],
			parentMovement: null // Will be populated if needed
		}));

		return ok(transformedMovements as MovementWithRelationsType[]);
	} catch (e) {
		console.error('Error fetching movements:', e);
		return err(new Error('Failed to fetch movements'));
	}
};

/**
 * Create a new movement with patterns and equipment
 */
export const createMovement = async (
	tx: DbTxType,
	data: MovementFormType
): Promise<Result<MovementType, Error>> => {
	try {
		// Insert the movement
		const [movement] = await tx
			.insert(movementsTable)
			.values({
				name: data.name,
				standards: data.standards,
				videoUrl: data.videoUrl || null,
				modalityId: data.modalityId,
				parentMovementId: data.parentMovementId || null
			})
			.returning();

		// Insert movement pattern associations with dominance
		if (data.patterns && data.patterns.length > 0) {
			await tx.insert(movementsToMovementPatternsTable).values(
				data.patterns.map((pattern) => ({
					movementId: movement.id,
					movementPatternId: pattern.id,
					dominance: pattern.dominance
				}))
			);
		}

		// Insert equipment associations
		if (data.equipmentIds && data.equipmentIds.length > 0) {
			await tx.insert(equipmentToMovementsTable).values(
				data.equipmentIds.map((equipmentId) => ({
					movementId: movement.id,
					equipmentId
				}))
			);
		}

		return ok(movement);
	} catch (e) {
		console.error('Error creating movement:', e);
		return err(new Error('Failed to create movement'));
	}
};

/**
 * Update an existing movement
 */
export const updateMovement = async (
	tx: DbTxType,
	data: MovementUpdateType
): Promise<Result<MovementType, Error>> => {
	try {
		// Update the movement
		const [movement] = await tx
			.update(movementsTable)
			.set({
				name: data.name,
				standards: data.standards,
				videoUrl: data.videoUrl || null,
				modalityId: data.modalityId,
				parentMovementId: data.parentMovementId || null
			})
			.where(eq(movementsTable.id, data.id))
			.returning();

		if (!movement) {
			return err(new Error('Movement not found'));
		}

		// Sync movement patterns - delete old, insert new
		if (data.patterns !== undefined) {
			// Delete existing associations
			await tx
				.delete(movementsToMovementPatternsTable)
				.where(eq(movementsToMovementPatternsTable.movementId, data.id));

			// Insert new associations
			if (data.patterns.length > 0) {
				await tx.insert(movementsToMovementPatternsTable).values(
					data.patterns.map((pattern) => ({
						movementId: data.id,
						movementPatternId: pattern.id,
						dominance: pattern.dominance
					}))
				);
			}
		}

		// Sync equipment - delete old, insert new
		if (data.equipmentIds !== undefined) {
			// Delete existing associations
			await tx
				.delete(equipmentToMovementsTable)
				.where(eq(equipmentToMovementsTable.movementId, data.id));

			// Insert new associations
			if (data.equipmentIds.length > 0) {
				await tx.insert(equipmentToMovementsTable).values(
					data.equipmentIds.map((equipmentId) => ({
						movementId: data.id,
						equipmentId
					}))
				);
			}
		}

		return ok(movement);
	} catch (e) {
		console.error('Error updating movement:', e);
		return err(new Error('Failed to update movement'));
	}
};

/**
 * Soft delete a movement
 */
export const deleteMovement = async (tx: DbTxType, id: string): Promise<Result<void, Error>> => {
	try {
		// Soft delete
		await tx
			.update(movementsTable)
			.set({ deletedAt: new Date() })
			.where(eq(movementsTable.id, id));

		return ok(undefined);
	} catch (e) {
		console.error('Error deleting movement:', e);
		return err(new Error('Failed to delete movement'));
	}
};
