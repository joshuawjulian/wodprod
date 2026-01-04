import type { DbTxType } from '$lib/server/db';
import type { EquipmentType, EquipmentFormType, EquipmentUpdateType } from '$lib/types';
import { Result, err, ok } from 'neverthrow';
import { equipmentTable } from '$lib/server/db/schema/schema';
import { eq, isNull } from 'drizzle-orm';

export const getAllEquipment = async (tx: DbTxType): Promise<Result<EquipmentType[], Error>> => {
	try {
		const equipment = await tx
			.select()
			.from(equipmentTable)
			.where(isNull(equipmentTable.deletedAt));
		return ok(equipment);
	} catch (e) {
		return err(new Error('Failed to fetch equipment'));
	}
};

export const createEquipment = async (
	tx: DbTxType,
	data: EquipmentFormType
): Promise<Result<EquipmentType, Error>> => {
	try {
		const [equipment] = await tx.insert(equipmentTable).values(data).returning();
		return ok(equipment);
	} catch (e) {
		return err(new Error('Failed to create equipment'));
	}
};

export const updateEquipment = async (
	tx: DbTxType,
	data: EquipmentUpdateType
): Promise<Result<EquipmentType, Error>> => {
	try {
		const [equipment] = await tx
			.update(equipmentTable)
			.set(data)
			.where(eq(equipmentTable.id, data.id))
			.returning();

		if (!equipment) {
			return err(new Error('Equipment not found'));
		}

		return ok(equipment);
	} catch (e) {
		return err(new Error('Failed to update equipment'));
	}
};

export const deleteEquipment = async (tx: DbTxType, id: string): Promise<Result<void, Error>> => {
	try {
		// Soft delete
		await tx
			.update(equipmentTable)
			.set({ deletedAt: new Date() })
			.where(eq(equipmentTable.id, id));

		return ok(undefined);
	} catch (e) {
		return err(new Error('Failed to delete equipment'));
	}
};
