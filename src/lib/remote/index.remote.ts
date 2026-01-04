import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { getModalities } from '$lib/server/modules/modalities';
import {
	createMovementPattern,
	deleteMovementPattern,
	getAllMovementPatterns,
	updateMovementPattern
} from '$lib/server/modules/movement-patterns';
import {
	createEquipment,
	deleteEquipment,
	getAllEquipment,
	updateEquipment
} from '$lib/server/modules/equipment';
import {
	createMovement,
	deleteMovement,
	getAllMovements,
	updateMovement
} from '$lib/server/modules/movements';
import type {
	EquipmentFormType,
	EquipmentType,
	EquipmentUpdateType,
	ModalityType,
	MovementFormType,
	MovementPatternFormType,
	MovementPatternType,
	MovementPatternUpdateType,
	MovementUpdateType,
	MovementWithRelationsType
} from '$lib/types';
import {
	EquipmentFormSchema,
	EquipmentUpdateSchema,
	MovementFormSchema,
	MovementPatternFormSchema,
	MovementPatternUpdateSchema,
	MovementUpdateSchema
} from '$lib/types';
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

// Equipment
export const getEquipment = query(async (): Promise<EquipmentType[]> => {
	const result = await getAllEquipment(db);
	return result.match(
		(equipment) => equipment,
		(error) => {
			console.error('Error fetching equipment:', error);
			return [];
		}
	);
});

export const createEquipmentItem = command(
	EquipmentFormSchema,
	async (data: EquipmentFormType): Promise<{ success: boolean; error?: string }> => {
		const result = await createEquipment(db, data);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);

export const updateEquipmentItem = command(
	EquipmentUpdateSchema,
	async (data: EquipmentUpdateType): Promise<{ success: boolean; error?: string }> => {
		const result = await updateEquipment(db, data);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);

export const deleteEquipmentItem = command(
	z.uuidv7(),
	async (id: string): Promise<{ success: boolean; error?: string }> => {
		const result = await deleteEquipment(db, id);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);

// Movements
export const getMovements = query(async (): Promise<MovementWithRelationsType[]> => {
	const result = await getAllMovements(db);
	return result.match(
		(movements) => movements,
		(error) => {
			console.error('Error fetching movements:', error);
			return [];
		}
	);
});

export const createMovementItem = command(
	MovementFormSchema,
	async (data: MovementFormType): Promise<{ success: boolean; error?: string }> => {
		const result = await createMovement(db, data);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);

export const updateMovementItem = command(
	MovementUpdateSchema,
	async (data: MovementUpdateType): Promise<{ success: boolean; error?: string }> => {
		const result = await updateMovement(db, data);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);

export const deleteMovementItem = command(
	z.uuidv7(),
	async (id: string): Promise<{ success: boolean; error?: string }> => {
		const result = await deleteMovement(db, id);
		return result.match(
			() => ({ success: true }),
			(error) => ({ success: false, error: error.message })
		);
	}
);
