import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { getModalities } from '$lib/server/modules/modalities';
import {
	createMovementPattern,
	deleteMovementPattern,
	getAllMovementPatterns,
	updateMovementPattern
} from '$lib/server/modules/movement-patterns';
import type {
	ModalityType,
	MovementPatternFormType,
	MovementPatternType,
	MovementPatternUpdateType
} from '$lib/types';
import { MovementPatternFormSchema, MovementPatternUpdateSchema } from '$lib/types';
import { z } from 'zod';

export const getAllModalities = query(async (): Promise<ModalityType[]> => {
	const result = await getModalities(db);
	return result.match(
		(modalities) => modalities,
		(error) => {
			console.error('Error fetching modalities:', error);
			return [];
		}
	);
});

// Movement Patterns
export const getMovementPatterns = query(async (): Promise<MovementPatternType[]> => {
	const result = await getAllMovementPatterns(db);
	return result.match(
		(patterns) => patterns,
		(error) => {
			console.error('Error fetching movement patterns:', error);
			return [];
		}
	);
});

export const createPattern = command(
	MovementPatternFormSchema,
	async (data: MovementPatternFormType): Promise<{ success: boolean; error?: string }> => {
		const result = await createMovementPattern(db, data);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);

export const updatePattern = command(
	MovementPatternUpdateSchema,
	async (data: MovementPatternUpdateType): Promise<{ success: boolean; error?: string }> => {
		const result = await updateMovementPattern(db, data);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);

export const deletePattern = command(
	z.uuidv7(),
	async (id: string): Promise<{ success: boolean; error?: string }> => {
		const result = await deleteMovementPattern(db, id);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);
